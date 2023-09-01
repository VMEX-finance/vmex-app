import React, { useEffect } from 'react';
import { IoIosClose } from 'react-icons/io';
import { AssetDisplay } from '../displays';
import { BasicToggle } from '../toggles';
import { ethers, utils } from 'ethers';
import { AVAILABLE_ASSETS, DEFAULT_NETWORK, truncateAddress } from '../../../utils';
import { AutoCompleteInput } from '.';
import { useSubgraphAllAssetMappingsData } from '../../../api';
import { getNetwork } from '@wagmi/core';

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
    _adminFee?: string[];
    setAdminFee?: any;
    direction?: 'top' | 'bottom';
    listStayOpen?: boolean;
    noShow?: boolean;
    originalList?: string[];
    setWhitelisting?: any;
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
        className={`border border-brand-black dark:bg-neutral-800 ${
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
    _adminFee,
    setAdminFee,
    direction,
    listStayOpen,
    noShow = false,
    originalList = [],
    setWhitelisting,
}: IListInput) => {
    const { findAssetInMappings } = useSubgraphAllAssetMappingsData();
    const [value, setValue] = React.useState('');
    const [isOpen, setIsOpen] = React.useState(false);
    const [error, setError] = React.useState('');
    const network = getNetwork()?.chain?.unsupported
        ? DEFAULT_NETWORK
        : getNetwork()?.chain?.name?.toLowerCase() || DEFAULT_NETWORK;

    const handleType = (e: any, val = '') => {
        const toBeSet = val ? val : value;
        if (e.key === 'Enter') {
            if (
                coin &&
                !AVAILABLE_ASSETS[network]
                    .map((coin) => coin.symbol.toUpperCase())
                    .includes(toBeSet.toUpperCase())
            ) {
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
            if (_adminFee && setAdminFee) {
                const shallow2 = _adminFee.length !== 0 ? [..._adminFee] : [];
                shallow2.push(
                    findAssetInMappings(toBeSet)?.vmexReserveFactor
                        ? ethers.utils.formatUnits(
                              findAssetInMappings(toBeSet)?.vmexReserveFactor || '0',
                              '16',
                          )
                        : '20',
                ); //default reserve factor of that asset
                setAdminFee(shallow2);
            }
            setValue('');
        }
    };

    const handleChange = (e: any) => {
        setValue(e.target.value);
    };

    const removeFromList = (itemToRemove: any) => {
        if (list && list.length > 0) {
            const shallow = [...list];
            const shallow2 = _adminFee && _adminFee.length !== 0 ? [..._adminFee] : [];
            shallow.map((el, i) => {
                if (el === itemToRemove) {
                    shallow.splice(i, 1);
                    if (shallow2) shallow2.splice(i, 1);
                }
            });
            setList(shallow);
            if (shallow2 && setAdminFee) {
                setAdminFee(shallow2);
            }
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

    useEffect(() => {
        if (setWhitelisting) setWhitelisting(isOpen);
    }, [isOpen]);

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
                    className={`w-full flex flex-col justify-between mt-1 rounded-xl border border-neutral-300 dark:border-neutral-700 p-2 ${
                        error ? 'border-red-500' : 'border-gray-300'
                    }`}
                >
                    <div className="flex flex-col justify-between gap-3">
                        <div className="w-full flex gap-3 items-center justify-between">
                            <div className="max-w-[250px]">
                                <AutoCompleteInput
                                    value={value}
                                    setValue={setValue}
                                    onChange={handleChange}
                                    onKeyDown={handleType}
                                    placeholder={placeholder}
                                    close={error.length !== 0}
                                    list={autocomplete}
                                    direction={direction}
                                    stayOpen={listStayOpen}
                                />
                            </div>
                            {value && value.length > 2 && (
                                <span className="text-sm text-neutral-400 whitespace-nowrap">
                                    Press Enter
                                </span>
                            )}
                        </div>
                        {noShow === false && (
                            <div className="flex gap-2 flex-wrap min-h-[26.3px]">
                                {originalList?.map((el, i: number) => (
                                    <ListInputItem
                                        key={i}
                                        value={el}
                                        remove={removeFromList}
                                        noDelete={noDelete}
                                        coin={coin}
                                    />
                                ))}
                                {list?.map((el, i: number) => (
                                    <ListInputItem
                                        key={i}
                                        value={el}
                                        remove={removeFromList}
                                        noDelete={false}
                                        coin={coin}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
            {error && <p className="text-red-500">{error || 'Invalid input'}</p>}
        </>
    );
};
