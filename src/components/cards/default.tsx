import React from "react";

type ICardProps = {
  children: React.ReactNode | React.ReactNode[];
  color?: string;
  black?: boolean;
  padding?: string;
}

const Card = ({ children, color, black, padding }: ICardProps) => (
  <div className={`
    w-full rounded-lg 
    ${color ? color : black ? 'bg-neutral-900 text-neutral-100' : 'bg-white'}
    ${padding ? padding : 'p-8'}
  `}>
    {children}
  </div>
)

export { Card };