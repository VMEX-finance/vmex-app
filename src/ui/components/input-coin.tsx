import React from 'react';
import { bigNumberToUSD, NETWORKS, getNetworkName } from '@/utils';
import { useSigner } from 'wagmi';
import { mintTokens } from '@vmexfinance/sdk';
import { Button, SmartPrice, AssetDisplay } from '@/ui/components';
import { usePricesData, useSubgraphAllAssetMappingsData } from '@/api';
import { BigNumber, utils } from 'ethers';

export interface ICoinInput {
    amount: string;
    setAmount?: React.Dispatch<React.SetStateAction<string>>;
    coin: {
        logo?: string;
        name: string;
    };
    balance?: string;
    type?: 'collateral' | 'owed' | 'default';
    isMax?: boolean;
    setIsMax?: React.Dispatch<React.SetStateAction<boolean>>;
    loading?: boolean;
    customMaxClick?: any;
    disabled?: boolean;
}

export const CoinInput = ({
    amount,
    setAmount,
    coin,
    balance,
    type,
    isMax,
    setIsMax,
    loading,
    customMaxClick,
    disabled,
}: ICoinInput) => {
    const network = getNetworkName();
    const { data: signer } = useSigner();
    const { prices } = usePricesData();
    const { findAssetInMappings } = useSubgraphAllAssetMappingsData();

    const onChange = (e: any) => {
        const myamount = e.target.value;
        const isFirstDecimal = amount.length === 0 && myamount === '.';
        if (!myamount || myamount.match(/^\d{1,}(\.\d{0,})?$/) || isFirstDecimal) {
            if (isFirstDecimal) {
                setAmount && setAmount(`0${myamount}`);
            } else {
                setAmount && setAmount(myamount);
            }
            setIsMax && setIsMax(false);
        }
    };

    const onMaxButtonClick = () => {
        if (customMaxClick) {
            customMaxClick();
            return;
        } else {
            balance && setAmount ? setAmount(balance) : {};
            setIsMax && setIsMax(true);
        }
    };

    const calculateUsd = () => {
        // TODO: improve
        const decimals = findAssetInMappings(coin?.name)?.decimals || 18;
        let usdBig: BigNumber;
        if (prices && coin?.name) {
            usdBig = (prices as any)[coin?.name?.toUpperCase()]?.usdPrice;
        } else {
            usdBig = BigNumber.from('0');
        }
        return usdBig
            ? bigNumberToUSD(usdBig.mul(utils.parseUnits(amount || '0', decimals)), 26)
            : `$${amount || '0.00'}`;
    };

    const mint = async () => {
        if (!NETWORKS[network].testing) return;
        if (signer && coin) {
            const res = await mintTokens({
                token: coin.name,
                signer: signer,
                network: network,
                test: NETWORKS[network].testing,
                providerRpc: NETWORKS[network].rpc,
            });
            console.log(`Minted ${coin.name} to wallet`);
            return res;
        }
    };

    return (
        <>
            <div className="w-full flex flex-col justify-between mt-1 rounded-xl border border-neutral-300 dark:border-neutral-700 p-2 gap-3">
                <div className="flex flex-row justify-between gap-1.5">
                    <input
                        type="text"
                        value={amount}
                        onChange={onChange}
                        className="text-2xl focus:outline-none max-w-[200px] sm:max-w-[250px] dark:bg-brand-black overflow-auto dark:placeholder:text-neutral-700"
                        placeholder="0.00"
                        disabled={disabled}
                    />
                    <AssetDisplay logo={coin?.logo} name={coin.name} />
                </div>
                {setIsMax && (
                    <div className="flex flex-row justify-end items-end gap-3">
                        {/* TODO: add usd value */}
                        {/* <div className="text-neutral-400">{calculateUsd()} USD</div> */}
                        <Button
                            onClick={onMaxButtonClick}
                            disabled={disabled}
                            type="link"
                            size="sm"
                        >
                            <div className="leading-none flex flex-col justify-end items-end text-xs">
                                <span>MAX</span>
                                <span className="flex items-center gap-1">
                                    {`${
                                        type === 'collateral'
                                            ? 'Amount Borrowable'
                                            : type === 'owed'
                                            ? 'Amount Owed'
                                            : 'Balance'
                                    }:`}{' '}
                                    {<SmartPrice price={String(balance) || '0'} />}
                                </span>
                            </div>
                        </Button>
                    </div>
                )}
            </div>
            {NETWORKS[network].testing && (
                <div className="mt-2 flex justify-end">
                    <Button
                        type="accent"
                        onClick={mint}
                        className="w-fit"
                    >{`Mint ${coin.name}`}</Button>
                </div>
            )}
        </>
    );
};
