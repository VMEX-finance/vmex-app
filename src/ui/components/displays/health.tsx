import React from 'react';
import { TbInfinity } from 'react-icons/tb';
import { BsArrowRight } from 'react-icons/bs';

interface IHealthFactorProps {
    value?: number;
    liquidation: number;
}

export const HealthFactor = ({ value, liquidation }: IHealthFactorProps) => (
    <div className="flex flex-col">
        <div className="flex items-center gap-2">
            <TbInfinity color="#8CE58F" size="30px" />
            <BsArrowRight size="24px" />
            <span className="text-xl text-[#D9D001] font-semibold">{value || 0}</span>
        </div>
        <div>
            <span className="text-sm text-neutral-800">{`Liquidation at <${liquidation}`}</span>
        </div>
    </div>
);
