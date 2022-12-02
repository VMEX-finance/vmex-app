import React, { ReactNode } from 'react';
import ReactTooltip from 'react-tooltip';
import { BsInfoCircle } from 'react-icons/bs';

interface ITooltipProps {
    text: string;
    content?: ReactNode | string;
    size?: string;
    disable?: boolean;
}

export const Tooltip = ({ text, content, size, disable }: ITooltipProps) => {
    return (
        <>
            <p data-tip={text}>{content || <BsInfoCircle size={size || '18px'} />}</p>
            {!disable && <ReactTooltip backgroundColor="#000" />}
        </>
    );
};
