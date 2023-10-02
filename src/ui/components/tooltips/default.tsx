import React, { ReactNode } from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { BsInfoCircle } from 'react-icons/bs';

interface ITooltipProps {
    id?: string;
    content?: ReactNode;
    text?: string;
    size?: string;
    children?: ReactNode | string;
    position?: 'left' | 'right' | 'bottom' | 'top';
}

export const Tooltip = ({ text, size, children, position, content, id }: ITooltipProps) => {
    if (content) {
        return (
            <>
                <span data-tooltip-id={id} className="flex items-center">
                    {content}
                </span>
                <ReactTooltip id={id} className="!z-[999999999]">
                    {children}
                </ReactTooltip>
            </>
        );
    }
    return (
        <>
            <span data-tooltip-id={text} data-tooltip-content={text} className="flex items-center">
                {children || <BsInfoCircle size={size || '18px'} />}
            </span>
            <ReactTooltip place={position || 'top'} id={text} className="!z-[999999999]" />
        </>
    );
};
