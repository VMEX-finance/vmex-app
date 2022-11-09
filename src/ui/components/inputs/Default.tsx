import React from 'react';

type IInputProps = {
    number?: boolean;
    onType: any;
    value: string;
    placeholder?: string;
    size?: '2xl' | 'xl' | 'lg' | 'md';
    onEnter?: any;
};

export const DefaultInput = ({
    number,
    onType,
    value,
    placeholder,
    size,
    onEnter,
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
        <div className="w-full flex items-center gap-2">
            <input
                placeholder={placeholder}
                value={value}
                onChange={saveTyping}
                type={number ? 'number' : 'text'}
                onKeyDown={entering}
                className={`w-full ${textSize()} outline-none border-b-[3px] focus:border-black border-neutral-600`}
            />
            {onEnter && <button onClick={onEnter}>Save</button>}
        </div>
    );
};
