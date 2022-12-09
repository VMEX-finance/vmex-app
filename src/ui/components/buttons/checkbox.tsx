import React from 'react';

export interface ICheckboxProps {
    checked: boolean;
    disabled?: boolean;
    setChecked?: any;
    label: string;
    onClick?: any;
}

export const Checkbox = ({ checked, disabled, setChecked, label, onClick }: ICheckboxProps) => {
    const mode = disabled ? 'text-neutral100' : checked ? '' : 'accent-gray-300';
    return (
        <button
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => (onClick ? onClick : setChecked(!checked))}
        >
            <input
                type="checkbox"
                className={['cursor-pointer', mode].join(' ')}
                checked={checked}
                disabled={disabled}
            />
            <label htmlFor="button" className="cursor-pointer">
                {label}
            </label>
        </button>
    );
};
