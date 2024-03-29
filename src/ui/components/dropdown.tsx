import React, { Fragment, ReactNode, useEffect, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { RiArrowDropDownLine } from 'react-icons/ri';
import { CgSpinner } from 'react-icons/cg';
import { IoMdCheckmarkCircle } from 'react-icons/io';
import { NavItem } from '@/ui/base';
import { truncate as _truncate, capFirstLetter } from '@/utils';

export interface IDropdownItemProps {
    text: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    className?: string;
}

export interface IDropdownProps {
    items: Array<IDropdownItemProps | any>;
    primary?: boolean;
    border?: boolean | `border-${string}`;
    direction?: 'left' | 'right' | 'top';
    size?: 'lg' | 'md';
    selected?: string | string[];
    setSelected?: any;
    label?: string | ReactNode;
    reverse?: boolean;
    baseLink?: string;
    full?: boolean;
    multiselect?: boolean;
    title?: string;
    uppercase?: boolean;
    className?: string;
    truncate?: boolean;
    wrapperClass?: string;
    icon?: boolean;
    type?: 'fresh';
}

export const DefaultDropdown = ({
    items,
    primary,
    direction = 'left',
    size = 'md',
    selected = items && items.length > 0 ? items[0]?.text : 'Select one...',
    setSelected = () => {},
    label,
    reverse,
    baseLink,
    full,
    multiselect,
    border,
    title,
    uppercase,
    className,
    truncate,
    wrapperClass,
    icon,
    type,
}: IDropdownProps) => {
    const [list, setList] = useState([]);

    const determineColor = () => {
        switch (selected) {
            case 'Normal':
                return 'text-[#C8781B]';
            case 'Low':
                return 'text-red-300';
            case 'High':
                return 'text-green-300';
            default:
                return 'text-neutral-900';
        }
    };

    const mode = primary
        ? '!text-neutral-100 bg-neutral-800 hover:bg-neutral-700 hover:bg-neutral-700 text-neutral-900'
        : 'bg-neutral-300 hover:bg-[rgb(200,200,200)] ';
    const dark = `dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-100`;
    const shadow = 'shadow-sm hover:shadow-none';
    const textSize = size === 'lg' ? 'text-md' : 'text-sm';
    const iconSize = size === 'lg' ? '22px' : '18px';
    const paddingSize = icon ? 'py-1.5 pr-1 pl-2.5' : size === 'lg' ? 'py-1.5 pl-3 pr-2' : 'pl-2';
    const withBorder = border
        ? `border ${typeof border !== 'boolean' ? border : 'border-brand-black'}`
        : '';
    const roundedSize = size === 'lg' ? 'rounded-lg' : 'rounded-md';
    const displayOnly = label
        ? `lg:border lg:border-brand-black bg-white ${
              typeof label === 'string' ? '!px-4 !py-[3px]' : '!p-2'
          } !text-lg`
        : '';
    const determineDirection = () => {
        switch (direction) {
            case 'right':
                return 'origin-top-right';
            case 'top':
                return '-translate-y-[350px] origin-bottom-right';
            default:
                return 'right-0 origin-top-right ';
        }
    };

    const route = (e: any, item: any) => {
        e.preventDefault();
        window.open(`${baseLink}/${item.text}`);
    };

    const ifInList = (item: string) =>
        selected?.length > 0 && (selected.includes(item.toUpperCase()) || selected.includes(item));

    const handleMultiSelect = (e: any) => {
        e.preventDefault();
        const item = e.target.innerText;
        let shallow = selected?.length > 0 ? [...(selected as string[])] : [];
        if (ifInList(item)) {
            shallow = shallow.filter((el) => el.toUpperCase() !== item.toUpperCase());
        } else {
            shallow.push(item);
        }
        setSelected(shallow);
    };

    useEffect(() => {
        const notReversed = [...list].length;
        if (reverse && notReversed === list.length) setList(items.reverse() as any);
        else setList(items as any);
    }, [items, reverse, list]);

    return (
        <div className={`${wrapperClass ? wrapperClass : ''}`}>
            {title && (
                <div className="flex items-baseline justify-between">
                    <h3 className="mb-2">{title}</h3>
                    {multiselect && (
                        <span className="text-sm">
                            {selected?.length > 0 ? selected.length : 0} Selected
                        </span>
                    )}
                </div>
            )}

            <Menu as="div" className={`inline-block my-auto relative ${full ? 'w-full' : ''}`}>
                <Menu.Button
                    className={[
                        'inline-flex items-center w-full focus:outline-none focus:ring-none transition duration-100',
                        className,
                        determineColor(),
                        displayOnly,
                        mode,
                        textSize,
                        paddingSize,
                        withBorder,
                        full ? 'w-full' : '',
                        roundedSize,
                        dark,
                        shadow,
                        type === 'fresh' ? 'py-[7px] !bg-gray-100 dark:!bg-neutral-800' : '',
                    ].join(' ')}
                >
                    {label ? (
                        label
                    ) : (
                        <span className="inline-flex items-center justify-between w-full">
                            {!multiselect ? (
                                icon ? (
                                    <img
                                        src={selected as string}
                                        alt={selected as string}
                                        width={24}
                                        height={24}
                                    />
                                ) : (
                                    selected
                                )
                            ) : (
                                'Select One...'
                            )}{' '}
                            <RiArrowDropDownLine size={iconSize} />
                        </span>
                    )}
                </Menu.Button>

                {items && items.length > 0 && (
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Menu.Items
                            className={`absolute max-h-72 overflow-y-scroll bg-white mt-2 
                            ${full ? 'w-full overflow-visible min-w-max' : 'min-w-[180px]'} 
                            ${determineDirection()}
                            rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-[999999]`}
                        >
                            <div className={`p-2 flex flex-col gap-1${multiselect ? 'gap-1' : ''}`}>
                                {list &&
                                    list.map((item: any, i) => (
                                        <Menu.Item key={`${item}-${i}`}>
                                            {({ active }) =>
                                                !multiselect ? (
                                                    <div
                                                        className={`flex items-center gap-2`}
                                                        key={`dropdown-${i}`}
                                                    >
                                                        <NavItem
                                                            label={
                                                                <span
                                                                    className={`flex justify-between items-center ${
                                                                        item?.className || ''
                                                                    }`}
                                                                >
                                                                    {icon ? (
                                                                        <span className="flex items-center gap-1.5">
                                                                            <img
                                                                                src={item.icon}
                                                                                alt={item.text}
                                                                                width={25}
                                                                                height={25}
                                                                            />
                                                                            <span>
                                                                                {capFirstLetter(
                                                                                    item.text,
                                                                                )}
                                                                            </span>
                                                                        </span>
                                                                    ) : (
                                                                        <>
                                                                            {uppercase ? (
                                                                                truncate ? (
                                                                                    _truncate(
                                                                                        item.text.toUpperCase(),
                                                                                        3,
                                                                                    )
                                                                                ) : (
                                                                                    item.text.toUpperCase()
                                                                                )
                                                                            ) : truncate ? (
                                                                                _truncate(
                                                                                    item.text,
                                                                                    3,
                                                                                )
                                                                            ) : (
                                                                                <span>
                                                                                    {item.text}
                                                                                </span>
                                                                            )}
                                                                            {item?.status &&
                                                                            item.status ===
                                                                                'pending' ? (
                                                                                <CgSpinner
                                                                                    size="20px"
                                                                                    className="animate-spin"
                                                                                />
                                                                            ) : (
                                                                                item?.status && (
                                                                                    <IoMdCheckmarkCircle size="20px" />
                                                                                )
                                                                            )}
                                                                            {item?.value &&
                                                                                item?.value !==
                                                                                    '0.0' && (
                                                                                    <span className="relative h-2 w-2 rounded-full bg-brand-purple" />
                                                                                )}
                                                                        </>
                                                                    )}
                                                                </span>
                                                            }
                                                            onClick={
                                                                baseLink
                                                                    ? (e: any) => route(e, item)
                                                                    : item.onClick
                                                                    ? item.onClick
                                                                    : (e: any) =>
                                                                          setSelected(
                                                                              e.target.innerText,
                                                                          )
                                                            }
                                                            mobile
                                                        />
                                                    </div>
                                                ) : (
                                                    <NavItem
                                                        key={`dropdown-${i}`}
                                                        label={
                                                            uppercase ? item.toUpperCase() : item
                                                        }
                                                        onClick={handleMultiSelect}
                                                        mobile
                                                        highlighted={ifInList(item)}
                                                    />
                                                )
                                            }
                                        </Menu.Item>
                                    ))}
                            </div>
                        </Menu.Items>
                    </Transition>
                )}
            </Menu>
        </div>
    );
};
