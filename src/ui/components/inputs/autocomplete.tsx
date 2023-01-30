import React, { FC, Fragment, useState } from 'react';
import { Transition } from '@headlessui/react';

type IAutoCompleteInputProps = {
    value: string;
    onKeyDown?: any;
    onChange: (e: any) => void;
    placeholder?: string;
    list?: string[];
    close?: boolean;
    setValue: (e: any) => void;
};

export const AutoCompleteInput: FC<IAutoCompleteInputProps> = ({
    value,
    onChange,
    onKeyDown,
    placeholder,
    list,
    close,
    setValue,
}) => {
    const [isFocused, setIsFocused] = useState(false);

    const renderList = () => {
        // TODO: implement auto complete list dropdown
        if (!list) return [];
        return list;
    };

    return (
        <div className="flex flex-col w-full">
            <input
                type="text"
                value={value}
                className="text-2xl focus:outline-none flex-grow dark:bg-black"
                placeholder={placeholder}
                onKeyDown={onKeyDown}
                onChange={onChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
            />
            {list && list.length !== 0 && (
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                    show={isFocused && !close}
                >
                    <div
                        className={`origin-top-right absolute bg-white dark:bg-black mt-10 min-w-[180px]
        rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-[999999]`}
                    >
                        <div className={`p-2 flex flex-col max-h-[200px] overflow-y-scroll`}>
                            {renderList().map((item: any, i) => (
                                <button
                                    key={`${item}-${i}`}
                                    className="transition duration-150 hover:bg-neutral-200 dark:hover:bg-neutral-800 py-2 rounded-lg"
                                    onClick={(e) => {
                                        setValue(item);
                                        setTimeout(() => {}, 200);
                                        onKeyDown && onKeyDown({ key: 'Enter' }, item);
                                    }}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>
                </Transition>
            )}
        </div>
    );
};
