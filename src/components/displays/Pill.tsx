import React from 'react';

type IPillDisplay = {
  asset: string;
  value: string | number;
}

const PillDisplay = (props: IPillDisplay) => {
  return (
    <div className="bg-transparent border border-neutral-100 rounded-3xl flex items-center gap-3 w-fit px-5 py-1">
      <span className="text-2xl">{props.asset || 'BTC'}</span>
      <span className="text-xl">{props.value || 0}</span>
    </div>
  )
}

export { PillDisplay };