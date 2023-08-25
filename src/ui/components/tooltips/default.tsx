import React, { ReactNode } from 'react';
import ReactTooltip from 'react-tooltip';
import { BsInfoCircle } from 'react-icons/bs';

interface ITooltipProps {
    text: string;
    content?: ReactNode | string;
    size?: string;
    disable?: boolean;
    children?: ReactNode;
    position?: 'left' | 'right' | 'bottom' | 'top';
}

export const Tooltip = ({ text, content, size, disable, children, position }: ITooltipProps) => {
    return (
        <>
            <span data-tip={text}>
                {content || children || <BsInfoCircle size={size || '18px'} />}
            </span>
            <ReactTooltip
                effect="solid"
                backgroundColor="#000"
                disable={disable}
                place={position || 'top'}
            />
        </>
    );
};
