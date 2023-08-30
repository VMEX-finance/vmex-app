import React, { FC, Fragment, useState } from 'react';
import { Transition } from '@headlessui/react';
import { AssetDisplay } from '../displays';

type IAutoCompleteInputProps = {
    value: string;
    onKeyDown?: any;
    onChange: (e: any) => void;
    placeholder?: string;
    list?: string[];
    close?: boolean;
    setValue: (e: any) => void;
    direction?: 'top' | 'bottom';
    stayOpen?: boolean;
};

export const AutoCompleteInput: FC<IAutoCompleteInputProps> = ({
    value,
    onChange,
    onKeyDown,
    placeholder,
    list,
    close,
    setValue,
    direction = 'bottom',
    stayOpen,
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
                className="text-2xl focus:outline-none flex-grow dark:bg-brand-black"
                placeholder={placeholder}
                onKeyDown={onKeyDown}
                onChange={onChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => (stayOpen ? {} : setIsFocused(false))}
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
                        className={`
                            ${
                                direction === 'bottom'
                                    ? 'origin-top-right mt-10'
                                    : stayOpen
                                    ? '-translate-y-64'
                                    : '-translate-y-56'
                            }
                            absolute bg-white dark:bg-brand-black min-w-[180px]
                            rounded-md shadow-lg ring-1 ring-brand-black ring-opacity-5 focus:outline-none z-[999999]
                        `}
                    >
                        <div className={`p-2 flex flex-col max-h-[200px] overflow-y-scroll`}>
                            {renderList().map((item: any, i) => (
                                <button
                                    key={`${item}-${i}`}
                                    className="transition duration-100 hover:bg-neutral-200 dark:hover:bg-neutral-800 py-2 rounded-lg"
                                    onClick={(e) => {
                                        setValue(item);
                                        setTimeout(() => {}, 200);
                                        onKeyDown && onKeyDown({ key: 'Enter' }, item);
                                    }}
                                >
                                    <AssetDisplay name={item} className="pl-2" />
                                </button>
                            ))}
                        </div>
                        {stayOpen && (
                            <button
                                className="w-full py-1 bg-red-600 text-white border-red-600 hover:bg-red-500 hover:border-red-500 rounded-b-lg shadow-md"
                                onClick={() => setIsFocused(false)}
                            >
                                Close
                            </button>
                        )}
                    </div>
                </Transition>
            )}
        </div>
    );
};
