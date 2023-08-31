import React, { ReactNode, useState } from 'react';
import { Switch } from '@headlessui/react';
import { IconType } from 'react-icons';

interface IToggleProps {
    checked?: boolean;
    onChange?: any;
    onClick?: any;
    colors?: string[];
    disabled?: boolean;
    size?: 'small' | 'medium' | 'large';
    customIcon?: ReactNode;
}

export const BasicToggle = ({
    checked,
    onChange,
    onClick,
    colors,
    disabled,
    size = 'medium',
    customIcon,
}: IToggleProps) => {
    const [enabled, setEnabled] = useState(false);
    const determineSize = (): string[] => {
        switch (size) {
            case 'large':
                return [
                    'h-7 w-14',
                    'h-5 w-5',
                    checked || enabled ? 'translate-x-8' : 'translate-x-1',
                ];
            case 'small':
                return [
                    'h-[18px] w-8',
                    'h-3 w-3',
                    checked || enabled ? 'translate-x-[1.1rem]' : 'translate-x-[0.15rem]',
                ];
            default:
                return [
                    'h-6 w-11',
                    'h-4 w-4',
                    checked || enabled ? 'translate-x-6' : 'translate-x-1',
                ];
        }
    };
    return (
        <Switch
            disabled={disabled}
            checked={checked || enabled}
            onChange={onChange || setEnabled}
            onClick={onClick}
            className={`${disabled ? 'opacity-70' : ''} ${
                colors
                    ? checked || enabled
                        ? colors[0]
                        : colors[1]
                    : checked || enabled
                    ? 'bg-green-400 dark:bg-brand-green'
                    : 'bg-neutral-700'
            } relative inline-flex ${determineSize()[0]} items-center rounded-full`}
        >
            {customIcon ? (
                <span
                    className={`${determineSize()[2]} inline-block ${
                        determineSize()[1]
                    } transform rounded-full bg-neutral-100 dark:bg-neutral-100 transition flex justify-center items-center`}
                >
                    {customIcon}
                </span>
            ) : (
                <>
                    {' '}
                    <span className="sr-only">Enable</span>
                    <span
                        className={`${determineSize()[2]} inline-block ${
                            determineSize()[1]
                        } transform rounded-full bg-neutral-100 dark:bg-neutral-100 transition`}
                    />
                </>
            )}
        </Switch>
    );
};

/* Transition the switch's knob on state change */
// className={`transform transition ease-in-out duration-200
//   ${enabled ? "translate-x-9" : "translate-x-0"}
// `}
