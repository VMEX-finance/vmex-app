import { AssetDisplay } from '../displays/asset';
import React from 'react';
import { bigNumberToUSD, NETWORKS, TESTING, getNetworkName } from '@/utils';
import { useSigner } from 'wagmi';
import { mintTokens } from '@vmexfinance/sdk';
import { Button, SecondaryButton } from '../buttons';
import { usePricesData } from '@/api';
import { BigNumber, utils } from 'ethers';
import { SmartPrice } from '../displays';

export interface ICoinInput {
    amount: string;
    setAmount: React.Dispatch<React.SetStateAction<string>>;
    coin: {
        logo: string;
        name: string;
    };
    balance?: string;
    type?: 'collateral' | 'owed' | 'default';
    isMax?: boolean;
    setIsMax: React.Dispatch<React.SetStateAction<boolean>>;
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
    const onChange = (e: any) => {
        const myamount = e.target.value;
        const isFirstDecimal = amount.length === 0 && myamount === '.';
        if (!myamount || myamount.match(/^\d{1,}(\.\d{0,})?$/) || isFirstDecimal) {
            if (isFirstDecimal) {
                setAmount(`0${myamount}`);
            } else {
                setAmount(myamount);
            }
            setIsMax(false);
        }
    };

    const onMaxButtonClick = () => {
        if (customMaxClick) {
            customMaxClick();
            return;
        } else {
            balance ? setAmount(balance) : {};
            setIsMax(true);
        }
    };

    const calculateUsd = () => {
        const decimals = 18;
        let usdBig;
        if (prices) {
            usdBig = (prices as any)[coin.name].usdPrice;
        } else {
            usdBig = BigNumber.from('0');
        }
        const bigNumAmount = utils.parseUnits(amount || '0', decimals);
        if (TESTING) console.log('USD:', bigNumberToUSD(usdBig.mul(bigNumAmount), decimals));
        return bigNumberToUSD(usdBig.mul(bigNumAmount), decimals);
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
                    <AssetDisplay logo={coin.logo} name={coin.name} />
                </div>
                <div className="flex flex-row justify-end items-end gap-3">
                    {/* TODO: add usd value */}
                    {/* <div className="text-neutral-400">{calculateUsd()} USD</div> */}
                    <SecondaryButton
                        onClick={onMaxButtonClick}
                        loading={loading}
                        disabled={disabled}
                    >
                        <span>MAX</span>
                        <p className="flex items-center gap-1">
                            {`${
                                type === 'collateral'
                                    ? 'Amount Borrowable'
                                    : type === 'owed'
                                    ? 'Amount Owed'
                                    : 'Balance'
                            }:`}{' '}
                            {<SmartPrice price={String(balance) || '0'} />}
                        </p>
                    </SecondaryButton>
                </div>
            </div>
            {NETWORKS[network].testing && (
                <div className="mt-2 flex justify-end">
                    <Button primary onClick={mint} label={`Mint ${coin.name}`} className="w-fit" />
                </div>
            )}
        </>
    );
};
