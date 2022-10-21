import React, { ReactNode } from 'react';
import ReactTooltip from 'react-tooltip';
import { BsInfoCircle } from 'react-icons/bs';

interface ITooltipProps {
    text: string;
    icon?: ReactNode;
    size?: string;
}

export const IconTooltip = ({ text, icon, size }: ITooltipProps) => {
    return (
        <>
            <p data-tip={text}>{icon || <BsInfoCircle size={size || '18px'} />}</p>
            <ReactTooltip />
        </>
    );
};
