import React from 'react';

export interface ICheckboxProps {
    checked: boolean;
    disabled?: boolean;
    label: string;
    onClick?: any;
}

export const Checkbox = ({ checked, disabled, label, onClick }: ICheckboxProps) => {
    const mode = disabled ? 'text-neutral100' : checked ? '' : 'accent-gray-300';
    return (
        <button
            className="flex items-center gap-2 cursor-pointer"
            onClick={onClick ? onClick : () => {}}
        >
            <input
                name="checkbox"
                type="checkbox"
                className={['cursor-pointer disabled:cursor-not-allowed', mode].join(' ')}
                checked={checked}
                disabled={disabled}
                onChange={() => {}}
            />
            <label htmlFor="checkbox" className="cursor-pointer">
                {label}
            </label>
        </button>
    );
};
