import React, { ReactNode } from 'react';
import ReactTooltip from 'react-tooltip';
import { BsInfoCircle } from 'react-icons/bs';

interface ITooltipProps {
    text: string;
    content?: ReactNode | string;
    size?: string;
    disable?: boolean;
    children?: ReactNode;
}

export const Tooltip = ({ text, content, size, disable, children }: ITooltipProps) => {
    return (
        <>
            <span data-tip={text}>
                {content || children || <BsInfoCircle size={size || '18px'} />}
            </span>
            <ReactTooltip effect="solid" backgroundColor="#000" disable={disable} />
        </>
    );
};
