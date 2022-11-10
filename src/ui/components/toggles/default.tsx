import React, { useState } from 'react';
import { Switch } from '@headlessui/react';

interface IToggleProps {
    checked?: boolean;
    onChange?: any;
    colors?: string[];
    disabled?: boolean;
}

export const BasicToggle = ({ checked, onChange, colors, disabled }: IToggleProps) => {
    const [enabled, setEnabled] = useState(false);

    return (
        <Switch
            disabled={disabled}
            checked={checked || enabled}
            onChange={onChange || setEnabled}
            className={`${
                colors
                    ? checked || enabled
                        ? colors[0]
                        : colors[1]
                    : checked || enabled
                    ? 'bg-green-400'
                    : 'bg-neutral-700'
            } relative inline-flex h-6 w-11 items-center rounded-full`}
        >
            <span className="sr-only">Enable notifications</span>
            <span
                className={`${
                    checked || enabled ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition`}
            />
        </Switch>
    );
};

/* Transition the switch's knob on state change */
// className={`transform transition ease-in-out duration-200
//   ${enabled ? "translate-x-9" : "translate-x-0"}
// `}
