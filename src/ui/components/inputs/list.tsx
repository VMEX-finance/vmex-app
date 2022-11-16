import React, { useEffect } from 'react';
import { IoIosClose } from 'react-icons/io';
import { AssetDisplay } from '../displays';
import { BasicToggle } from '../toggles';
import { truncateAddress } from '../../../utils/helpers';
import { utils } from 'ethers';
import { AVAILABLE_ASSETS } from '../../../utils/constants';

export interface IListInput {
    coin?: boolean;
    list?: string[];
    setList?: any;
    placeholder?: string;
    title?: string;
    toggle?: boolean;
    noDelete?: boolean;
    required?: boolean;
}

export const ListInput = ({
    coin,
    list,
    setList,
    placeholder,
    title,
    toggle,
    noDelete,
    required,
}: IListInput) => {
    const [value, setValue] = React.useState('');
    const [isOpen, setIsOpen] = React.useState(false);
    const [error, setError] = React.useState('');

    const handleType = (e: any) => {
        if (e.key === 'Enter') {
            if (coin && !AVAILABLE_ASSETS.includes(value.toUpperCase())) {
                setError('Please enter a valid token.');
                return;
            }
            if (!coin && !utils.isAddress(value)) {
                setError('Please enter a valid address.');
                return;
            }
            if (list?.includes(value)) {
                setError(`${coin ? 'Token' : 'Address'} has already been entered.`);
                return;
            }
            setError('');
            const shallow = list && list.length !== 0 ? [...list] : [];
            shallow.push(value);
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
        const interval = setInterval(() => setError(''), 10000);
        return () => clearInterval(interval);
    }, [value]);

    useEffect(() => {
        if (list && list?.length > 0) setIsOpen(true);
    }, [list]);

    // TODO: implement dropdown for available coins
    return (
        <>
            <div className="flex justify-between items-end">
                <h3 className="mt-6 mb-1 text-gray-400">
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
                            <input
                                type="text"
                                value={value}
                                className="text-2xl focus:outline-none flex-grow"
                                placeholder={placeholder}
                                onKeyDown={handleType}
                                onChange={handleChange}
                            />
                            {value && value.length > 2 && (
                                <span className="text-sm text-gray-400">Press Enter</span>
                            )}
                        </div>
                        <div className="flex gap-2 flex-wrap min-h-[26.3px]">
                            {list?.map((el, i: number) => (
                                <button
                                    key={i}
                                    onClick={(e) => (noDelete ? {} : removeFromList(el))}
                                    className={`border border-black ${
                                        noDelete
                                            ? 'pl-3 pr-4 cursor-default'
                                            : 'pl-3 pr-2 cursor-pointer'
                                    } rounded-md flex items-center gap-2`}
                                >
                                    {coin ? (
                                        <AssetDisplay
                                            name={el}
                                            size="sm"
                                            className="max-h-[26.28px]"
                                        />
                                    ) : (
                                        <span>{truncateAddress(el)}</span>
                                    )}
                                    {!noDelete && <IoIosClose className="w-6 h-6" />}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            {error && <p className="text-red-500">{error || 'Invalid input'}</p>}
        </>
    );
};
