import React, { ReactNode } from 'react';
import { Tooltip } from './tooltip-default';

type ILabelProps = {
    children: string | ReactNode;
    color?: 'purple' | 'green' | 'pink' | 'blue';
    className?: string;
    tooltip?: string | true;
};

export const Label = ({ children, className = '', color = 'purple', tooltip }: ILabelProps) => {
    const render = () => {
        let customClass = ``;
        let _tooltip = ``;
        if (color === 'blue' || children === 'Verified') {
            customClass = 'bg-gradient-to-r from-indigo-500 to-blue-400';
            _tooltip = 'This is a verfied and audited tranche.';
        } else if (color === 'green' || children === 'External') {
            customClass = 'bg-gradient-to-r from-green-500 to-emerald-500';
            _tooltip = 'This is an external tranche from a third-party.';
        } else if (color === 'pink') {
            customClass = 'bg-gradient-to-r from-rose-500 to-pink-400';
        } else if (children === 'VMEX') {
            _tooltip = 'This is a VMEX featured tranche.';
            customClass = 'bg-gradient-to-r from-violet-500 to-purple-400';
        } else if (children === 'Standard') {
            _tooltip =
                'This is a standard tranche that any permissionless actor created following our risk guidelines.';
            customClass = 'bg-gradient-to-r from-neutral-500 to-gray-400';
        } else {
            customClass = 'bg-gradient-to-r from-neutral-500 to-gray-400';
        }
        return {
            class: `px-1.5 2xl:px-2 py-0.5 text-xs text-neutral-100 font-medium rounded-lg text-center tracking-wide ${customClass} ${color} ${className}`,
            tooltip: tooltip && typeof tooltip === 'string' ? tooltip : _tooltip,
        };
    };

    if (tooltip)
        return (
            <Tooltip text={render().tooltip}>
                <span className={render().class}>{children}</span>
            </Tooltip>
        );
    return <span className={render().class}>{children}</span>;
};
