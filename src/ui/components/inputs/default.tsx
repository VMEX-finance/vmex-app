import React from 'react';
import { Tooltip } from '../tooltips';

type IInputProps = {
    type?: 'number' | 'percent' | 'string';
    onType: any;
    value: string;
    placeholder?: string;
    size?: '2xl' | 'xl' | 'lg' | 'md';
    onEnter?: any;
    title?: string;
    tooltip?: string;
    required?: boolean;
    className?: string;
    inputClass?: string;
    max?: number;
    validate?: boolean;
    min?: number;
};

export const DefaultInput = ({
    type = 'string',
    onType,
    value,
    placeholder,
    size,
    onEnter,
    title,
    tooltip,
    required,
    className,
    inputClass,
    max,
    validate,
    min,
}: IInputProps) => {
    const saveTyping = (e: any): void => {
        e.preventDefault();
        if (validate) {
            const letterNumberSpace = /^[a-zA-Z0-9 ]*$/;
            if (e.target.value.match(letterNumberSpace)) {
                onType(e.target.value);
            }
        } else {
            onType(e.target.value);
        }
    };

    const textSize = () => {
        switch (size) {
            case '2xl':
                return 'text-2xl';
            case 'xl':
                return 'text-xl';
            case 'lg':
                return 'text-lg';
            default:
                return 'text-md';
        }
    };

    const entering = (e: any) => {
        if (e.key === 'Enter' && onEnter) onEnter;
    };

    return (
        <div className={`${className}`}>
            {title && (
                <>
                    {tooltip ? (
                        <Tooltip
                            text={tooltip}
                            content={
                                <h3 className="mb-1">
                                    {title}
                                    {required && <span className="text-red-500 ml-1">*</span>}
                                </h3>
                            }
                        />
                    ) : (
                        <h3 className="mb-1">
                            {title}
                            {required && <span className="text-red-500 ml-1">*</span>}
                        </h3>
                    )}
                </>
            )}
            <div className="flex flex-col">
                <div className="w-full flex items-center gap-2">
                    <input
                        placeholder={placeholder}
                        value={value}
                        onChange={saveTyping}
                        type={
                            type !== 'string' && (type === 'percent' || type === 'number')
                                ? 'number'
                                : 'text'
                        }
                        step={type === 'percent' ? '0.1' : '1'}
                        onKeyDown={entering}
                        className={`w-full ${textSize()} outline-none border-b-[3px] focus:border-brand-black dark:focus:border-white border-neutral-600 dark:bg-brand-black ${
                            inputClass ? inputClass : 'bg-transparent'
                        }`}
                        maxLength={max}
                        min={min || '0'}
                    />
                    {onEnter && <button onClick={onEnter}>Save</button>}
                </div>
                {max && (
                    <span className="self-end text-xs">
                        {value.length}/{max}
                    </span>
                )}
            </div>
        </div>
    );
};
