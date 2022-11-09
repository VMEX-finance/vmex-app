import React, { ReactNode } from 'react';
import ReactTooltip from 'react-tooltip';
import { BsInfoCircle } from 'react-icons/bs';

interface ITooltipProps {
    text: string;
    content?: ReactNode | string;
    size?: string;
}

export const Tooltip = ({ text, content, size }: ITooltipProps) => {
    return (
        <>
            <p data-tip={text}>{content || <BsInfoCircle size={size || '18px'} />}</p>
            <ReactTooltip />
        </>
    );
};
