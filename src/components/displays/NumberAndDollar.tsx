import React from "react";

type INumberAndDollarProps = {
  label?: string;
  value?: number | string | undefined;
  dollar?: number;
  color?: string;
}

const NumberAndDollar = ({ label, value, dollar, color }: INumberAndDollarProps) => {
  return (
    <div className={`flex flex-col ${color ? color : 'text-brand-purple'}`}>
      {label && (
        <span className="text-neutral-100">{label}</span>
      )}
      <span className="text-2xl">{value || "0.0"}</span>
      <span className="text-sm">${dollar || '0.00'}</span>
    </div>
  )
}

export { NumberAndDollar };