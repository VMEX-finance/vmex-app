import React, { ReactNode } from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { BsInfoCircle } from 'react-icons/bs';

interface ITooltipProps {
    text: string;
    size?: string;
    children?: ReactNode | string;
    position?: 'left' | 'right' | 'bottom' | 'top';
}

export const Tooltip = ({ text, size, children, position }: ITooltipProps) => {
    return (
        <>
            <span data-tooltip-id={text} data-tooltip-content={text}>
                {children || <BsInfoCircle size={size || '18px'} />}
            </span>
            <ReactTooltip place={position || 'top'} id={text} className="!z-[999999999]" />
        </>
    );
};
