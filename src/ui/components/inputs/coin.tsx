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
}

export const CoinInput = ({ amount, setAmount, coin, balance, type }: ICoinInput) => {
    return (
        <div className="w-full flex flex-row justify-between mt-1 rounded-xl border border-gray-300 p-2">
            <div className="flex flex-col justify-between gap-3">
                <input
                    type="text"
                    value={amount}
                    onChange={(e: any) => setAmount(e.target.value)}
                    className="text-2xl focus:outline-none max-w-[200px]"
                    placeholder="0.00"
                />
                <div className="text-neutral400">USD</div>
            </div>
            <div className="flex flex-col justify-between items-end gap-3">
                <AssetDisplay logo={coin.logo} name={coin.name} />
                <button
                    className="text-xs text-right text-blue-700 hover:text-brand-purple transition duration-150"
                    onClick={() => (balance ? setAmount(balance) : {})}
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
