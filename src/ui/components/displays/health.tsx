import React from 'react';
import { TbInfinity } from 'react-icons/tb';
import { BsArrowRight } from 'react-icons/bs';

interface IHealthFactorProps {
    value?: number | string;
    liquidation?: number | string;
    size?: 'sm' | 'md' | 'lg';
    withChange?: boolean;
}

export const HealthFactor = ({
    value,
    liquidation,
    size = 'md',
    withChange = true,
}: IHealthFactorProps) => {
    const determineSize = () => {
        switch (size) {
            case 'sm':
                return ['24px', '18px', 'text-lg'];
            case 'md':
                return ['30px', '24px', 'text-xl'];
            case 'lg':
                return ['36px', '30px', 'text-2xl'];
        }
    };
    return (
        <div className="flex flex-col">
            <div className="flex items-center gap-2">
                {withChange && (
                    <>
                        <TbInfinity color="#8CE58F" size={`${determineSize()[0]}`} />
                        <BsArrowRight size={`${determineSize()[1]}`} />
                    </>
                )}
                {/* TODO: color should change based on health value */}
                <span className={`${determineSize()[2]} text-[#D9D001] font-semibold`}>
                    {value || 0}
                </span>
            </div>
            {liquidation && (
                <div>
                    <span className="text-sm text-neutral-800">{`Liquidation at <${liquidation}`}</span>
                </div>
            )}
        </div>
    );
};
