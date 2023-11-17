import { useUserData } from '@/api';
import { NETWORKS, isAddressEqual, isPoolStable } from '@/utils';
import { VeloPoolABI, VeloRouterABI } from '@/utils/abis';
import { multicall, readContract } from '@wagmi/core';
import { BigNumber } from 'ethers';
import { getAddress } from 'ethers/lib/utils.js';
import { useEffect, useState } from 'react';
import { useAccount, useNetwork } from 'wagmi';

export const useZap = (symbolOrAddress: string) => {
    const { chain } = useNetwork();
    const [assets, setAssets] = useState<{ symbol: string; address: string; amount: string }[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { address: wallet } = useAccount();
    const { queryUserWallet } = useUserData(wallet);
    console.log('zapp', queryUserWallet?.data);

    async function handleZap(e: any) {
        e?.preventDefault();
        // TODO: fico - handle zapping
    }

    async function readVeloPoolDetails(lpAddress: string) {
        const veloPoolContract = {
            address: getAddress(lpAddress),
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

    async function generateZapInParams(
        lpAddress: string,
        zapAsset: `0x${string}`,
        zapAmount: BigNumber,
    ) {
        if (!chain?.network) return;

        const [token0, token1, stable] = await readVeloPoolDetails(lpAddress);

        const { veloFactoryAddress: factory, veloRouterAddress } = NETWORKS[chain.network];
        if (!veloRouterAddress || !factory) return;

        if (isAddressEqual(token0, zapAsset)) {
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
                    BigNumber.from(0),
                    zapAmount,
                    [],
                    [{ from: zapAsset, to: token1, stable, factory }],
                ],
            });
        } else if (isAddressEqual(token1, zapAsset)) {
            // zap asset is one of the lp underyling tokens -> token1
            const stable = isPoolStable(chain.network, zapAsset, token0);
            return readContract({
                address: veloRouterAddress,
                abi: VeloRouterABI,
                functionName: 'generateZapInParams',
                args: [
                    token0,
                    token1,
                    stable,
                    factory,
                    zapAmount,
                    BigNumber.from(0),
                    [{ from: zapAsset, to: token0, stable, factory }],
                    [],
                ],
            });
        } else {
            // zap asset is NOT one of the lp underyling tokens
            const stable0 = isPoolStable(chain.network, zapAsset, token0);
            const stable1 = isPoolStable(chain.network, zapAsset, token1);
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
                    [{ from: zapAsset, to: token0, stable: stable0, factory }],
                    [{ from: zapAsset, to: token1, stable: stable1, factory }],
                ],
            });
        }
    }

    useEffect(() => {
        if (!symbolOrAddress || !queryUserWallet?.data) return;

        (async () => {
            const zappableTokens = queryUserWallet.data.assets
                .filter(
                    (x) => x.asset.length < 5 && x.amount !== '$0.00', // TODO what other way to filter out simple ERC20s than < 5 characters?
                )
                .sort((a, b) => b.amount.localeCompare(a.amount));

            setAssets(
                zappableTokens.map((x) => {
                    return {
                        symbol: x.asset,
                        address: x.assetAddress,
                        amount: x.amount,
                    };
                }),
            );
        })().catch((err) => console.error(err));
    }, [symbolOrAddress, queryUserWallet]);

    return {
        zappableAssets: assets,
        handleZap,
        isLoading,
        generateZapInParams,
    };
};
