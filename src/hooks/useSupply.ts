import { ISupplyBorrowProps } from '../ui/modals';
import { useEffect, useState } from 'react';
import { IUseModal } from './useModal';
import {
    useSubgraphAllAssetMappingsData,
    useSubgraphTrancheData,
    useUserData,
    useUserTrancheData,
} from '../api';
import { useAccount, useSigner } from 'wagmi';
import { IYourSuppliesTableItemProps } from '../ui/tables';
import {
    DECIMALS,
    IAvailableCoins,
    NETWORK,
    SDK_PARAMS,
    bigNumberToUnformattedString,
    convertStringFormatToNumber,
    nativeAmountToUSD,
} from '../utils';
import { BigNumber, BigNumberish, Wallet, utils } from 'ethers';
import {
    claimIncentives,
    convertAddressToSymbol,
    estimateGas,
    supply,
    withdraw,
} from '@vmexfinance/sdk';

export const useSupply = ({
    data,
    submitTx,
    isSuccess,
    error,
    isLoading,
    view,
    setView,
    isMax,
    setIsMax,
    amount,
    setAmount,
}: ISupplyBorrowProps & IUseModal) => {
    const { findAssetInMarketsData } = useSubgraphTrancheData(data?.trancheId || 0);
    const { data: signer } = useSigner();
    const { address } = useAccount();
    const { findAssetInUserSuppliesOrBorrows, queryUserRewardsData, queryRewardsData } =
        useUserTrancheData(address, data?.trancheId || 0);
    const { queryAssetPrices } = useSubgraphAllAssetMappingsData();
    const { getTokenBalance } = useUserData(address);

    const [asCollateral, setAsCollateral] = useState<any>(data?.collateral);
    const [existingSupplyCollateral, setExistingSupplyCollateral] = useState(false);
    const [estimatedGasCost, setEstimatedGasCost] = useState({ cost: '0', loading: false });
    const [asset, setAsset] = useState(data?.asset || '');

    const toggleEthWeth = () => {
        if (data?.asset.toLowerCase() === 'weth') {
            if (asset.toLowerCase() === 'weth') setAsset('ETH');
            else setAsset('WETH');
        }
    };
    const amountWalletNative = getTokenBalance(asset || '');
    const apy = findAssetInMarketsData(asset || '')?.supplyRate;
    const amountWithdraw =
        findAssetInUserSuppliesOrBorrows(asset, 'supply')?.amountNative || data?.amountNative;
    const collateral = (
        findAssetInUserSuppliesOrBorrows(asset || '', 'supply') as IYourSuppliesTableItemProps
    )?.collateral;

    const defaultFunctionParams = {
        trancheId: data ? data.trancheId : 0,
        amount: convertStringFormatToNumber(amount),
        signer: signer
            ? signer
            : new Wallet('0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e'),
        network: NETWORK,
        isMax: isMax,
        test: SDK_PARAMS.test,
        providerRpc: SDK_PARAMS.providerRpc,
    };

    const getAllATokenAddresses = () => {
        return (
            queryRewardsData.data?.map<string>((el): string => {
                return el.aTokenAddress;
            }) || []
        );
    };

    const handleSubmit = async () => {
        if (signer && data) {
            await submitTx(async () => {
                let res;
                if (view?.includes('Supply')) {
                    res = await supply({
                        ...defaultFunctionParams,
                        underlying: asset,
                        collateral:
                            typeof collateral === 'boolean'
                                ? existingSupplyCollateral
                                : asCollateral,
                        // referrer: number,
                        // collateral: boolean,
                    });
                } else if (view?.includes('Claim')) {
                    res = await claimIncentives({
                        ...defaultFunctionParams,
                        to: await defaultFunctionParams.signer.getAddress(),
                        incentivizedATokens: getAllATokenAddresses(),
                    });
                } else {
                    res = await withdraw({
                        ...defaultFunctionParams,
                        asset,
                        // interestRateMode: 2,
                        // referrer: number,
                        // collateral: boolean,
                        // test: boolean
                    });
                }
                return res;
            });
        }
    };

    const maxOnClick = () => {
        setAmount(
            view?.includes('Supply')
                ? bigNumberToUnformattedString(amountWalletNative.amountNative, asset || '')
                : bigNumberToUnformattedString(amountWithdraw, asset || ''),
        );
        setIsMax(true);
    };

    const isViolatingSupplyCap = function () {
        if (!amount || !view?.includes('Supply')) return false;
        const supplyCap = Number(findAssetInMarketsData(asset || '')?.supplyCap);
        const currentSupplied = Number(findAssetInMarketsData(asset || '')?.totalSupplied); //already considers decimals
        const newTotalSupply = Number(amount) + currentSupplied;
        if (newTotalSupply > supplyCap) {
            return true;
        }
        return false;
    };

    const isViolatingMax = () => {
        if (asset && amount) {
            if (amount.includes('.') && amount.split('.')[1].length > (DECIMALS.get(asset) || 18)) {
                return true;
            } else {
                const inputAmount = utils.parseUnits(amount, DECIMALS.get(asset));
                return inputAmount.gt(
                    view?.includes('Supply')
                        ? amountWalletNative.amountNative
                        : amountWithdraw || BigNumber.from('0'),
                );
            }
        }
        return false;
    };

    const renderRewards = () => {
        if (!queryUserRewardsData?.data?.rewardTokens?.length) return [];
        return queryUserRewardsData.data?.rewardTokens?.map((el: string, idx) => {
            const assetSymbol = convertAddressToSymbol(el, SDK_PARAMS.network) || el;
            const assetDecimals = DECIMALS.get(assetSymbol);
            let assetAmount: BigNumberish =
                queryUserRewardsData.data?.rewardAmounts[idx] || 'unable to get reward amount';
            if (assetDecimals && queryAssetPrices.data) {
                // if the asset decimals mapping exists
                const assetUSDPrice =
                    queryAssetPrices.data[assetSymbol as IAvailableCoins].usdPrice;
                assetAmount = '$'.concat(
                    String(nativeAmountToUSD(assetAmount, assetDecimals, assetUSDPrice)),
                );
            }
            return {
                label: assetSymbol,
                value: assetAmount.toString(),
                loading: queryRewardsData.isLoading,
            };
        });
    };

    const isButtonDisabled = () => {
        if (view?.includes('Claim')) {
            if (!queryUserRewardsData?.data?.rewardTokens?.length) return true;
            return false;
        } else {
            return (
                isSuccess ||
                error.length !== 0 ||
                (!amount && !isMax) ||
                (view?.includes('Supply') && amountWalletNative.amountNative.lt(10)) ||
                (view?.includes('Withdraw') && (!amountWithdraw || amountWithdraw.lt(10))) ||
                isViolatingSupplyCap() ||
                isViolatingMax()
            );
        }
    };

    useEffect(() => {
        if (data?.view) setView('Withdraw');
    }, [data?.view, setView]);

    useEffect(() => {
        if (typeof collateral === 'boolean') setExistingSupplyCollateral(collateral);
    }, [collateral]);

    useEffect(() => {
        const getter = async () => {
            setEstimatedGasCost({ ...estimatedGasCost, loading: true });
            if (signer && data) {
                let res;
                if (view?.includes('Supply')) {
                    res = await estimateGas({
                        ...defaultFunctionParams,
                        function: 'supply',
                        underlying: asset,
                    });
                } else if (view?.includes('Claim')) {
                    if (queryRewardsData.data) {
                        res = await estimateGas({
                            ...defaultFunctionParams,
                            function: 'claimRewards',
                            incentivizedAssets: getAllATokenAddresses(),
                            to: await defaultFunctionParams.signer.getAddress(),
                        });
                    }
                } else {
                    res = await estimateGas({
                        ...defaultFunctionParams,
                        function: 'withdraw',
                        asset: asset,
                    });
                }
                setEstimatedGasCost({
                    loading: false,
                    cost: `$${String(
                        nativeAmountToUSD(res || 0, 18, queryAssetPrices.data?.WETH.usdPrice || 0),
                    )}`,
                });
            }
        };
        getter();
    }, [view, data, isMax, amount, signer]);

    return {
        amountWalletNative,
        maxOnClick,
        isViolatingMax,
        isViolatingSupplyCap,
        collateral,
        existingSupplyCollateral,
        setExistingSupplyCollateral,
        asCollateral,
        setAsCollateral,
        apy,
        renderRewards,
        estimatedGasCost,
        queryUserRewardsData,
        amountWithdraw,
        handleSubmit,
        view,
        setView,
        isSuccess,
        error,
        amount,
        setAmount,
        isMax,
        setIsMax,
        isLoading,
        isButtonDisabled,
        toggleEthWeth,
        isEth: data?.asset?.toLowerCase() === 'weth' && asset === 'ETH' ? true : false,
        asset,
    };
};
