import { constants, utils } from 'ethers';
import { SyntheticEvent, useEffect, useState } from 'react';
import { useUserData } from '@/api';
import { DECIMALS, NETWORKS, isAddressEqual, isPoolStable, toAddress, toSymbol } from '@/utils';
import { VeloPoolABI, VeloRouterABI } from '@/utils/abis';
import {
    erc20ABI,
    multicall,
    prepareWriteContract,
    readContract,
    writeContract,
} from '@wagmi/core';
import { BigNumber } from 'ethers';
import { getAddress, parseUnits } from 'ethers/lib/utils.js';
import { useAccount, useNetwork } from 'wagmi';
import { formatUnits } from 'ethers/lib/utils.js';
import { convertSymbolToAddress } from '@vmexfinance/sdk';

const EMPTY_TOKEN = { address: '', symbol: '' };

type IZapAssetProps = { symbol: string; address: string; amount: string };
type IVeloPoolDetails = { token0: `0x${string}`; token1: `0x${string}`; stable: boolean };

const ONE_BN = BigNumber.from(1);
const ZERO_BN = BigNumber.from(0);

export const useZap = (
    symbolOrAddress: string,
    existingZapAsset?: any,
    existingZappableAssets?: IZapAssetProps[],
) => {
    const [assets, setAssets] = useState<IZapAssetProps[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [zapAsset, setZapAsset] = useState({ address: '', symbol: '' });
    const [zapAmount, setZapAmount] = useState('');
    const [zapBalance, setZapBalance] = useState('0');
    const [isMaxZap, setIsMaxZap] = useState(false);
    // const [zapOutput, setZapOutput] = useState('');
    const { chain } = useNetwork();
    const [veloPoolDetails, setVeloPoolDetails] = useState<IVeloPoolDetails>();
    const { address: wallet } = useAccount();
    const { queryUserWallet } = useUserData(wallet);

    const lpAddress = symbolOrAddress
        ? convertSymbolToAddress(symbolOrAddress, chain?.network || '')
        : undefined;
    const zapAmountNative =
        zapAmount !== ''
            ? parseUnits(zapAmount, DECIMALS.get(zapAsset.symbol) || 18)
            : BigNumber.from(0);

    function handleZap(e: any, token: IZapAssetProps) {
        e?.preventDefault();
        if (isAddressEqual(token.address, zapAsset.address)) {
            setZapAsset(EMPTY_TOKEN);
            setZapBalance('0');
            return;
        }

        setZapAsset(token);
        setZapBalance(assets.find((x) => isAddressEqual(x.address, token.address))?.amount || '0');
    }
    async function zapIn() {
        if (!chain?.network) return;
        if (!veloPoolDetails) return;
        if (!wallet) return;

        const { veloFactoryAddress: factory, veloRouterAddress } = NETWORKS[chain.network];
        if (!veloRouterAddress || !factory) return;

        const { token0, token1, stable } = veloPoolDetails;

        if (isAddressEqual(token0, zapAsset.address)) {
            // zap asset is one of the lp underyling tokens -> token0
            const config = await prepareWriteContract({
                abi: VeloRouterABI,
                address: veloRouterAddress,
                functionName: 'zapIn',
                args: [
                    getAddress(zapAsset.address),
                    zapAmountNative.div(2),
                    zapAmountNative.div(2),
                    {
                        tokenA: token0,
                        tokenB: token1,
                        stable,
                        factory,
                        amountOutMinA: ONE_BN,
                        amountOutMinB: ONE_BN,
                        amountAMin: ONE_BN,
                        amountBMin: ONE_BN,
                    },
                    [],
                    [{ from: getAddress(zapAsset.address), to: token1, stable, factory }],
                    wallet,
                    false,
                ],
            });
            const tx = await writeContract(config);
            await tx.wait();
        } else if (isAddressEqual(token1, zapAsset.address)) {
            // zap asset is one of the lp underyling tokens -> token1
            const config = await prepareWriteContract({
                abi: VeloRouterABI,
                address: veloRouterAddress,
                functionName: 'zapIn',
                args: [
                    getAddress(zapAsset.address),
                    zapAmountNative.div(2),
                    zapAmountNative.div(2),
                    {
                        tokenA: token0,
                        tokenB: token1,
                        stable,
                        factory,
                        amountOutMinA: ONE_BN,
                        amountOutMinB: ONE_BN,
                        amountAMin: ONE_BN,
                        amountBMin: ONE_BN,
                    },
                    [{ from: getAddress(zapAsset.address), to: token0, stable, factory }],
                    [],
                    wallet,
                    false,
                ],
            });
            const tx = await writeContract(config);
            await tx.wait();
        } else {
            // zap asset is NOT one of the lp underyling tokens
            // TODO - currently not supported
        }
    }

    async function checkAllowance() {
        if (!chain?.network) return;
        if (!veloPoolDetails) return;
        if (!wallet) return;

        const { veloFactoryAddress: factory, veloRouterAddress } = NETWORKS[chain.network];
        if (!veloRouterAddress || !factory) return;

        const allowance = await readContract({
            address: getAddress(zapAsset.address),
            abi: erc20ABI,
            functionName: 'allowance',
            args: [wallet, veloRouterAddress],
        });

        if (allowance.lt(zapAmountNative)) {
            const config = await prepareWriteContract({
                address: getAddress(zapAsset.address),
                abi: erc20ABI,
                functionName: 'approve',
                args: [veloRouterAddress, constants.MaxUint256],
            });
            const tx = await writeContract(config);
            await tx.wait();
        }
    }

    async function submitZap(e: SyntheticEvent) {
        e.preventDefault();
        if (zapAmount && zapAsset) {
            await checkAllowance();
            await zapIn();
            // TODO: fico/alo - decide
            return zapAmount;
        }
    }

    async function getZapOutput() {
        // todo
        return '0.00';
    }

    function readVeloPoolDetails(poolAddress: string) {
        const veloPoolContract = {
            address: getAddress(poolAddress),
            abi: VeloPoolABI,
        };
        return multicall({
            contracts: [
                {
                    ...veloPoolContract,
                    functionName: 'token0',
                },
                {
                    ...veloPoolContract,
                    functionName: 'token1',
                },
                {
                    ...veloPoolContract,
                    functionName: 'stable',
                },
            ],
        });
    }

    async function generateZapInParams(lpAddress: string, zapAsset: string, zapAmount: BigNumber) {
        console.log('geeneratezapin', lpAddress, zapAsset, zapAmount);
        if (!chain?.network) return;
        if (!veloPoolDetails) return;

        const { veloFactoryAddress: factory, veloRouterAddress } = NETWORKS[chain.network];
        const { token0, token1, stable } = veloPoolDetails;
        if (!veloRouterAddress || !factory) return;

        if (isAddressEqual(token0, zapAsset)) {
            console.log('token0 in lp');
            // zap asset is one of the lp underyling tokens -> token0
            const stable = isPoolStable(chain.network, zapAsset, token1);
            return readContract({
                address: veloRouterAddress,
                abi: VeloRouterABI,
                functionName: 'generateZapInParams',
                args: [
                    token0,
                    token1,
                    stable,
                    factory,
                    ZERO_BN,
                    zapAmount.div(2),
                    [],
                    [{ from: getAddress(zapAsset), to: token1, stable, factory }],
                ],
            });
        } else if (isAddressEqual(token1, zapAsset)) {
            console.log('token1 in lp');
            // zap asset is one of the lp underyling tokens -> token1
            const stable = isPoolStable(chain.network, zapAsset, token0);
            console.log(stable);
            return readContract({
                address: veloRouterAddress,
                abi: VeloRouterABI,
                functionName: 'generateZapInParams',
                args: [
                    token0,
                    token1,
                    stable,
                    factory,
                    zapAmount.div(2),
                    ZERO_BN,
                    [{ from: getAddress(zapAsset), to: token0, stable, factory }],
                    [],
                ],
            });
        } else {
            // zap asset is NOT one of the lp underyling tokens
            const stable0 = isPoolStable(chain.network, zapAsset, token0);
            const stable1 = isPoolStable(chain.network, zapAsset, token1);
            console.log('not bla bla', stable0, stable1);
            return readContract({
                address: veloRouterAddress,
                abi: VeloRouterABI,
                functionName: 'generateZapInParams',
                args: [
                    token0,
                    token1,
                    stable,
                    factory,
                    zapAmount.div(2),
                    zapAmount.div(2),
                    [{ from: getAddress(zapAsset), to: token0, stable: stable0, factory }],
                    [{ from: getAddress(zapAsset), to: token1, stable: stable1, factory }],
                ],
            });
        }
    }

    useEffect(() => {
        if (!lpAddress) return;

        (async () => {
            const [token0, token1, stable] = await readVeloPoolDetails(lpAddress);
            setVeloPoolDetails({ token0, token1, stable });
        })();
    }, [lpAddress]);

    useEffect(() => {
        (async () => {
            if (!symbolOrAddress || !queryUserWallet?.data || !veloPoolDetails || assets?.length)
                return;
            const zappableTokens = queryUserWallet.data.assets
                .filter(
                    (x) =>
                        x.asset.length < 5 && // TODO what other way to filter out simple ERC20s than < 5 characters?
                        (isAddressEqual(x.assetAddress, veloPoolDetails.token0) ||
                            isAddressEqual(x.assetAddress, veloPoolDetails.token1)),
                )
                .sort((a, b) => b.amount.localeCompare(a.amount));

            if (JSON.stringify(assets) === JSON.stringify(zappableTokens)) return;

            setAssets(
                zappableTokens.map((x) => {
                    return {
                        symbol: x.asset,
                        address: x.assetAddress,
                        amount: formatUnits(x.amountNative, DECIMALS.get(x.asset)),
                    };
                }),
            );
        })().catch((err) => console.error(err));
    }, [symbolOrAddress, queryUserWallet, veloPoolDetails]);

    useEffect(() => {
        if (existingZappableAssets?.length) {
            setAssets(existingZappableAssets);
        }
        if (
            existingZapAsset?.address &&
            existingZapAsset?.symbol &&
            utils.isAddress(existingZapAsset?.address)
        ) {
            setZapAsset({ address: existingZapAsset.address, symbol: existingZapAsset.symbol });
        }
    }, [existingZapAsset, existingZappableAssets?.length]);

    return {
        zappableAssets: assets,
        handleZap,
        isLoading,
        zapAsset,
        zapBalance,
        zapAmount,
        setZapAmount,
        setIsMaxZap,
        submitZap,
        getZapOutput,
        generateZapInParams,
    };
};
