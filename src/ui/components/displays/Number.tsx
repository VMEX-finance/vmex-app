import React from "react";

type INumberProps = {
  label?: string;
  value: number | string | React.ReactNode;
}

export const Number = (props: INumberProps) => {
  return (
    <div className="flex flex-col">
        <span>{props.label}</span>
        <span className="text-brand-purple text-2xl">{props.value}</span>
    </div>
  )
}