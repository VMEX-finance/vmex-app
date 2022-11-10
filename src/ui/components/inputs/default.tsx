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
}: IInputProps) => {
    const saveTyping = (e: any): void => {
        e.preventDefault();
        onType(e.target.value);
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
        <div className="flex flex-col">
            {title && (
                <>
                    {tooltip ? (
                        <Tooltip
                            text={tooltip}
                            content={<h3 className="mt-6 mb-1 text-gray-400">{title}</h3>}
                        />
                    ) : (
                        <h3 className="mt-6 mb-1 text-gray-400">{title}</h3>
                    )}
                </>
            )}
            <div className="w-full flex items-center gap-2">
                <input
                    placeholder={placeholder}
                    value={value}
                    onChange={saveTyping}
                    type={type !== 'string' ? 'number' : 'text'}
                    step={type === 'percent' ? '0.1' : '1'}
                    onKeyDown={entering}
                    className={`w-full ${textSize()} outline-none border-b-[3px] focus:border-black border-neutral-600`}
                />
                {onEnter && <button onClick={onEnter}>Save</button>}
            </div>
        </div>
    );
};
