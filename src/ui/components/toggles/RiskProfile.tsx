import React from 'react';
import { Switch } from '@headlessui/react';

interface ITrancheToggle {
    name: string;
    active?: boolean;
    disabled?: boolean;
    value: number;
    max: number | string;
    onChange: (e: any) => void;
}

export const TranchToggle = ({ name, value, disabled, onChange, max }: ITrancheToggle) => {
    const [enabled, setEnabled] = React.useState(false);
    return (
        <div id={name}>
            <p className="font-medium text-gray-500">{name}</p>
            <span className="flex flex-row justify-between items-center">
                <Switch
                    checked={enabled}
                    onChange={setEnabled}
                    disabled={disabled}
                    className={`${
                        enabled ? (disabled ? 'bg-gray-200' : 'bg-black') : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 items-center rounded-full`}
                >
                    <span className="sr-only">Enable notifications</span>
                    <span
                        className={`${
                            enabled ? 'translate-x-6' : 'translate-x-1'
                        } inline-block h-4 w-4 transform rounded-full bg-white ${
                            disabled
                                ? "bg-transparent after:content-['x'] place-content-center text-red-400"
                                : ''
                        }`}
                    />
                </Switch>
                <input
                    type="range"
                    max={max}
                    placeholder="0"
                    value={disabled || !enabled ? 0 : value}
                    onChange={disabled || !enabled ? () => {} : onChange}
                    step={'.01'}
                    className=" accent-black w-max p-1 bg-gray-100 rounded-sm"
                />
            </span>
        </div>
    );
};
