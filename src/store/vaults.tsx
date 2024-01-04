import React, { createContext, ReactNode, useContext, useMemo } from 'react';
import { getNetworkName } from '../utils/network';
import {
    getAllAssetPrices,
    IGaugesAsset,
    IMarketsAsset,
    IVaultAsset,
    useGauages,
    useSubgraphAllMarketsData,
} from '@/api';
import { useQuery } from '@tanstack/react-query';
import { getBalance, LOGS, toNormalizedBN } from '@/utils';
import { BigNumber } from 'ethers';
import { useToken } from '@/hooks';
import { IAddress } from '@/types/wagmi';
import { useAccount } from 'wagmi';

// Types
export type IVaultsStoreProps = {
    vaults: IVaultAsset[];
    isLoading: boolean;
    isError: boolean;
    error?: unknown;
    refresh?: () => void;
};

const SECONDS_PER_YEAR = 60 * 60 * 24 * 365;
// Context
const VaultsContext = createContext<IVaultsStoreProps>({
    vaults: [],
    isLoading: false,
    isError: false,
    error: '',
    refresh: () => {},
});

/**
 *
 * @param rewardRate rewardRate of gauge, read from gauge contract
 * @param totalStaked totalStaked in gauge, read from gauge contract
 * @param dvmexPrice eth price (no decimals) of dVMEX token, calulated from VMEX price * discount rate
 * where VMEX price is calculated by querying the BPT Pool
 * @param tokenPrice eth price of the underlying token in the gauge
 * @returns
 */
const calculateApyFromRewardRate = (
    rewardRate: string | number,
    totalStaked: string | number,
    dvmexPrice: number,
    tokenPrice: number,
): number => {
    if (!rewardRate || !dvmexPrice || !tokenPrice) return 0;
    const _rewardRate = Number(rewardRate);
    const _totalStaked = Number(totalStaked);
    const _usdRewardsPerYear = _rewardRate * SECONDS_PER_YEAR * dvmexPrice;
    const _numTokensPurchasedByReward = _usdRewardsPerYear / tokenPrice;
    const _aprDecimal = _numTokensPurchasedByReward / _totalStaked;
    if (isNaN(_aprDecimal)) return 0;
    return _aprDecimal;
};

const getUnderlyingSymbolFromGauge = (gaugeSymbol: string) => {
    const len = gaugeSymbol.length;
    return gaugeSymbol.substring(4, len - 1).toUpperCase();
};

const getAssetUSDPrice = (prices: any, symbol: string): number => {
    if (!(symbol in prices)) {
        return 0;
    }
    // getAllAssetPrices uses the VMEXOracle, which always has 8 extra
    // zeroes after the usdPrice and ethPrice
    return prices[symbol].usdPrice / 10 ** 8;
};

// Utils
const renderGauges = async (gauges: IGaugesAsset[], user?: IAddress): Promise<IVaultAsset[]> => {
    if (!gauges.length) return [];

    const prices = await getAllAssetPrices();
    return await Promise.all(
        gauges.map(async (g: IGaugesAsset) => {
            const yourStaked = user
                ? ((await getBalance(g.address as any, user, 'raw')) as BigNumber)
                : BigNumber.from(0);
            return {
                ...g,
                gaugeAddress: g.address,
                vaultAddress: g.vaultAddress,
                decimals: g.decimals,
                vaultName: g.name,
                vaultApy: 0,
                vaultDeposited: g.totalStaked,
                gaugeAPR: 0,
                gaugeBoost: 0,
                gaugeStaked: g.totalStaked,
                vaultSymbol: g.symbol,
                actions: undefined,
                rewardRate: g.rewardRate,
                assetPrice: getAssetUSDPrice(prices, getUnderlyingSymbolFromGauge(g.symbol)),
                wethPrice: getAssetUSDPrice(prices, 'WETH'),
                yourStaked: toNormalizedBN(yourStaked),
            };
        }),
    );
};

export function getUnderlyingMarket(_vaultSymbol?: string, markets?: IMarketsAsset[]) {
    if (!_vaultSymbol || !markets?.length) return;
    const trimmed = _vaultSymbol?.substring(4);
    const trancheId = _vaultSymbol.slice(_vaultSymbol.length - 1);
    const symbol = trimmed.slice(0, trimmed.length - 1);
    const market = markets?.find(
        (el) =>
            String(el?.trancheId || 0) === String(trancheId) &&
            String(el.asset)?.toLowerCase() === String(symbol)?.toLowerCase(),
    );
    return market;
}

// Wrapper
export function VaultsStore(props: { children: ReactNode }) {
    const network = getNetworkName();
    const { address } = useAccount();
    const { queryGauges } = useGauages();
    const { dvmexPriceInEthNoDecimals } = useToken();
    const { queryAllMarketsData } = useSubgraphAllMarketsData();

    const queryVaults = useQuery({
        queryKey: ['vaults', network, address],
        queryFn: () => renderGauges(queryGauges.data, address),
        enabled: queryGauges?.data?.length > 0,
        initialData: [],
        refetchInterval: 10 * 1000,
    });

    const vaults = useMemo(() => {
        if (queryAllMarketsData.data?.length && queryAllMarketsData?.isFetched) {
            const markets = queryAllMarketsData.data;
            const returnArr = queryVaults?.data?.map((v) => {
                const underlying = getUnderlyingMarket(v.vaultSymbol, markets);
                const gaugeStakedNormalized = toNormalizedBN(
                    v.gaugeStaked.raw,
                    underlying?.decimals,
                );
                return {
                    ...v,
                    vaultApy: Number(underlying?.supplyApy || '0'),
                    vaultDeposited: {
                        normalized: underlying?.supplyTotalNative || '0.0',
                        raw: BigNumber.from(0),
                    },
                    underlyingAddress: underlying?.assetAddress,
                    underlyingSymbol: underlying?.asset,
                    underlyingDecimals: underlying?.decimals,
                    gaugeStaked: gaugeStakedNormalized,
                    gaugeAPR: calculateApyFromRewardRate(
                        v.rewardRate?.normalized || 0,
                        gaugeStakedNormalized.normalized,
                        dvmexPriceInEthNoDecimals * (v.wethPrice || 0),
                        v.assetPrice || 0,
                    ),
                    // TODO: yourStaked
                };
            });
            if (LOGS) console.log('Vaults:', returnArr);
            return returnArr;
        } else {
            return queryVaults.data;
        }
    }, [
        queryAllMarketsData?.data?.length,
        queryGauges?.data?.length,
        queryVaults?.data?.length,
        queryAllMarketsData?.isFetched,
    ]);

    return (
        <VaultsContext.Provider
            value={{
                vaults,
                isLoading: queryVaults.isLoading,
                isError: queryVaults.isError,
                error: queryVaults.error,
            }}
        >
            {props.children}
        </VaultsContext.Provider>
    );
}

// Independent
export function useVaultsContext() {
    return useContext(VaultsContext);
}
