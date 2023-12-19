import React, { ReactNode } from 'react';
import { Button } from './button';

type IStakeInput = {
    value: string | number;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    disabled?: boolean;
    header?: string;
    footer?: ReactNode | string;
    setMax?: (() => void) | any;
    error?: boolean;
};

export const StakeInput = ({
    value,
    onChange,
    disabled,
    header,
    footer,
    setMax,
    error,
}: IStakeInput) => {
    return (
        <div className="flex flex-col">
            {header ? <span className="text-sm">{header}</span> : <span className="min-h-[24px]" />}
            <div
                className={[
                    'flex',
                    'bg-neutral-100 dark:bg-neutral-800',
                    'p-1',
                    'rounded-lg',
                    `border ${
                        disabled ? 'border-gray-300' : error ? 'border-red-600' : 'border-gray-400'
                    }`,
                ].join(' ')}
            >
                <input
                    disabled={disabled}
                    value={value}
                    onChange={onChange}
                    className={['bg-transparent', 'w-full', 'focus:outline-none', 'pl-1'].join(' ')}
                    type="number"
                />
                {setMax && (
                    <Button
                        type="accent-strong"
                        className="w-fit"
                        size="sm"
                        padding="px-2 py-0.5"
                        onClick={setMax}
                    >
                        Max
                    </Button>
                )}
            </div>
            {footer ? (
                <span className={`text-[11px] leading-relaxed ${error ? 'text-red-600' : ''}`}>
                    {footer}
                </span>
            ) : (
                <span className="min-h-[17.88px]" />
            )}
        </div>
    );
};
