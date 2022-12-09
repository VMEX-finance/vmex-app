import React, { useEffect } from 'react';
import { IoIosClose } from 'react-icons/io';
import { AssetDisplay } from '../displays';
import { BasicToggle } from '../toggles';
import { truncateAddress } from '../../../utils/helpers';
import { utils } from 'ethers';
import { AVAILABLE_ASSETS } from '../../../utils/constants';
import { AutoCompleteInput } from '.';

export interface IListInput {
    coin?: boolean;
    list?: string[];
    setList?: any;
    placeholder?: string;
    title?: string;
    toggle?: boolean;
    noDelete?: boolean;
    required?: boolean;
    autocomplete?: string[];
}

export const ListInputItem = ({
    noDelete,
    coin,
    value,
    remove,
}: {
    noDelete?: boolean;
    coin?: boolean;
    value: string;
    remove: (e: any) => void;
}) => (
    <button
        onClick={(e) => (noDelete ? {} : remove(value))}
        className={`border border-black ${
            noDelete ? 'pl-3 pr-4 cursor-default' : 'pl-3 pr-2 cursor-pointer'
        } rounded-md flex items-center gap-2`}
    >
        {coin ? (
            <AssetDisplay name={value} size="sm" className="max-h-[26.28px]" />
        ) : (
            <span>{truncateAddress(value)}</span>
        )}
        {!noDelete && <IoIosClose className="w-6 h-6" />}
    </button>
);

export const ListInput = ({
    coin,
    list,
    setList,
    placeholder,
    title,
    toggle,
    noDelete,
    required,
    autocomplete,
}: IListInput) => {
    const [value, setValue] = React.useState('');
    const [isOpen, setIsOpen] = React.useState(false);
    const [error, setError] = React.useState('');

    const handleType = (e: any, val = '') => {
        const toBeSet = val ? val : value;
        if (e.key === 'Enter') {
            if (coin && !AVAILABLE_ASSETS.includes(toBeSet.toUpperCase())) {
                setError('Please enter a valid token.');
                setValue('');
                return;
            }
            if (!coin && !utils.isAddress(toBeSet)) {
                setError('Please enter a valid address.');
                return;
            }
            if (list?.includes(toBeSet)) {
                setError(`${coin ? 'Token' : 'Address'} has already been entered.`);
                setValue('');
                return;
            }
            setError('');
            const shallow = list && list.length !== 0 ? [...list] : [];
            shallow.push(toBeSet);
            setList(shallow);
            setValue('');
        }
    };

    const handleChange = (e: any) => {
        setValue(e.target.value);
    };

    const removeFromList = (itemToRemove: any) => {
        if (list && list.length > 0) {
            const shallow = [...list];
            shallow.map((el, i) => {
                if (el === itemToRemove) {
                    shallow.splice(i, 1);
                }
            });
            setList(shallow);
        }
    };

    const turnOff = () => {
        setList([]);
        setIsOpen(!isOpen);
    };

    const determineOpen = () => {
        if (toggle && !isOpen) return false;
        else return true;
    };

    useEffect(() => {
        const interval = setInterval(() => setError(''), 6000);
        return () => clearInterval(interval);
    }, [value]);

    useEffect(() => {
        if (list && list?.length > 0) setIsOpen(true);
    }, [list]);

    return (
        <>
            <div className="flex justify-between items-end">
                <h3 className="mt-6 mb-1 text-neutral400">
                    {title}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </h3>
                {toggle && <BasicToggle checked={isOpen} onChange={turnOff} />}
            </div>
            {determineOpen() && (
                <div
                    className={`w-full flex flex-col justify-between mt-1 rounded-xl border border-gray-300 p-2 ${
                        error ? 'border-red-500' : 'border-gray-300'
                    }`}
                >
                    <div className="flex flex-col justify-between gap-3">
                        <div className="w-full flex gap-3 items-center">
                            <AutoCompleteInput
                                value={value}
                                setValue={setValue}
                                onChange={handleChange}
                                onKeyDown={handleType}
                                placeholder={placeholder}
                                close={error.length !== 0}
                                list={autocomplete}
                            />
                            {value && value.length > 2 && (
                                <span className="text-sm text-neutral400 whitespace-nowrap">
                                    Press Enter
                                </span>
                            )}
                        </div>
                        <div className="flex gap-2 flex-wrap min-h-[26.3px]">
                            {list?.map((el, i: number) => (
                                <ListInputItem
                                    key={i}
                                    value={el}
                                    remove={removeFromList}
                                    noDelete={noDelete}
                                    coin={coin}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
            {error && <p className="text-red-500">{error || 'Invalid input'}</p>}
        </>
    );
};
