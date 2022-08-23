import React from 'react';

export interface ICoinInput {
  amount: string;
  setAmount: React.Dispatch<React.SetStateAction<string>>;
  coin: {
    logo: string;
    name: string;
  }
  balance?: string;
}

const CoinInput = ({ amount, setAmount, coin, balance }: ICoinInput) => {
  return (
    <div className="w-full flex flex-row justify-between mt-1 rounded-xl border border-gray-300 p-2">
      <div className="flex flex-col justify-between gap-3">
        <input type="text" value={amount} onChange={(e: any) => setAmount(e.target.value)} className="text-2xl focus:outline-none" placeholder="0.00"/>
        <div className="text-gray-400">USD</div>
      </div>
      <div className="flex flex-col justify-between gap-3">
        <div className="flex items-center gap-1">
          <img src={coin.logo} alt={coin.name} height="30" width="30" />
          {coin.name}
        </div>
        <div className="text-xs text-right text-blue-700">
          <span
            className="hover:text-brand-purple cursor-pointer transition duration-200"
            onClick={() => balance ? setAmount(balance) : {}}
          >
            MAX
          </span>
          <p>Balance: {balance || 0.3213}</p>
        </div>
      </div>
    </div>
  )
}

export default CoinInput;