import React from 'react';

const CustomTooltip = ({ active, payload, label }: any) => {
  console.log(active, payload, label)
  if (active && payload && payload.length) {
    return (
      <div className="bg-black px-2 py-1 flex flex-col">
        <span className="font-semibold">{payload[0].payload?.date}</span>
        <span>Amount: {payload[0].value}</span>
      </div>
    );
  }

  return null;
};

export { CustomTooltip };