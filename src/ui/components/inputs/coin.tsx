import { AssetDisplay } from '../displays/asset';
import React from 'react';
import { NETWORK, SDK_PARAMS } from '../../../utils/sdk-helpers';
import { useSigner } from 'wagmi';
import { mintTokens } from '@vmexfinance/sdk';
import { Button } from '../buttons';

export interface ICoinInput {
    amount: string;
    setAmount: React.Dispatch<React.SetStateAction<string>>;
    coin: {
        logo: string;
        name: string;
    };
    balance?: string;
    type?: 'collateral' | 'owed' | 'default';
    isMax: boolean;
    setIsMax: React.Dispatch<React.SetStateAction<boolean>>;
    loading?: boolean;
    customMaxClick?: any;
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
}: ICoinInput) => {
    const { data: signer } = useSigner();

    const onChange = (e: any) => {
        const myamount = e.target.value;
        if (!myamount || myamount.match(/^\d{1,}(\.\d{0,})?$/)) {
            setAmount(myamount);
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

    const mint = async () => {
        if (!process.env.REACT_APP_TEST) return;
        if (signer && coin) {
            const res = await mintTokens({
                token: coin.name,
                signer: signer,
                network: NETWORK,
                test: SDK_PARAMS.test,
                providerRpc: SDK_PARAMS.providerRpc,
            });
            console.log(`Minted ${coin.name} to wallet`);
            return res;
        }
    };

    return (
        <div className="w-full flex flex-row justify-between mt-1 rounded-xl border border-neutral-300 dark:border-neutral-700 p-2">
            <div className="flex flex-col justify-between gap-3">
                <input
                    type="text"
                    value={amount}
                    onChange={onChange}
                    className="text-2xl focus:outline-none max-w-[200px] dark:bg-black overflow-auto dark:placeholder:text-neutral-700"
                    placeholder="0.00"
                />
                {/* <div className="text-neutral400">USD</div> */}
                {/* TODO: add usd value underneath */}
                {process.env.REACT_APP_TEST && (
                    <Button
                        primary
                        onClick={mint}
                        label={`DEV: Mint ${coin.name}`}
                        className="w-fit"
                    />
                )}
            </div>
            <div className="flex flex-col justify-between items-end gap-3">
                <AssetDisplay logo={coin.logo} name={coin.name} />
                <button
                    className={`text-xs text-right text-blue-700 dark:text-brand-blue dark:hover:text-blue-500 hover:text-brand-purple transition duration-150 ${
                        loading ? 'animate-pulse' : ''
                    }`}
                    onClick={onMaxButtonClick}
                >
                    <span>MAX</span>
                    <p>
                        {`${
                            type === 'collateral'
                                ? 'Amount Borrowable'
                                : type === 'owed'
                                ? 'Amount Owed'
                                : 'Balance'
                        }:`}{' '}
                        {balance || 0}
                    </p>
                </button>
            </div>
        </div>
    );
};
