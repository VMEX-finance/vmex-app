import { AssetDisplay } from '../displays/asset';
import React from 'react';

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
}: ICoinInput) => {
    const onChange = (e: any) => {
        const myamount = e.target.value;
        if (!myamount || myamount.match(/^\d{1,}(\.\d{0,})?$/)) {
            setAmount(myamount);
            setIsMax(false);
        }
    };

    const onMaxButtonClick = () => {
        balance ? setAmount(balance) : {};
        setIsMax(true);
    };

    return (
        <div className="w-full flex flex-row justify-between mt-1 rounded-xl border border-gray-300 p-2">
            <div className="flex flex-col justify-between gap-3">
                <input
                    type="text"
                    value={amount}
                    onChange={onChange}
                    disabled={isMax}
                    style={{
                        opacity: isMax ? 0.25 : 1,
                        pointerEvents: isMax ? 'none' : 'initial',
                    }}
                    className="text-2xl focus:outline-none max-w-[200px] dark:bg-black"
                    placeholder="0.00"
                />
                <div className="text-neutral400">USD</div>
            </div>
            <div className="flex flex-col justify-between items-end gap-3">
                <AssetDisplay logo={coin.logo} name={coin.name} />
                <button
                    className={`text-xs text-right text-blue-700 hover:text-brand-purple transition duration-150 ${
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
