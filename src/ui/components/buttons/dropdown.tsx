import React, { Fragment, ReactNode, useEffect, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { RiArrowDropDownLine } from 'react-icons/ri';
import { CgSpinner } from 'react-icons/cg';
import { IoMdCheckmarkCircle } from 'react-icons/io';
import { MenuItemButton } from './menu-item';
import { truncate as _truncate } from '../../../utils/helpers';

interface IDropdownItemProps {
    text: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export interface IDropdownProps {
    items: Array<IDropdownItemProps | any>;
    primary?: boolean;
    border?: boolean;
    direction?: 'left' | 'right';
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
}

export const DropdownButton = ({
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
        ? '!text-neutral-100 bg-neutral-800 shadow-lg hover:bg-neutral-900'
        : 'hover:bg-neutral-100';

    const textSize = size === 'lg' ? 'text-lg' : 'text-sm';
    const iconSize = size === 'lg' ? '30px' : '24px';
    const paddingSize = size === 'lg' ? 'py-1 pl-4 pr-2' : 'pl-2';
    const withBorder = border ? 'border border-2 border-black' : '';
    const displayOnly = label
        ? `lg:border lg:border-black bg-white ${
              typeof label === 'string' ? '!px-4 !py-[3px]' : '!p-2'
          } !text-lg`
        : '';

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
        <>
            {title && (
                <div className="flex items-baseline justify-between">
                    <h3 className="mt-6 mb-2 text-gray-400">{title}</h3>
                    {multiselect && (
                        <span className="text-sm">
                            {selected?.length > 0 ? selected.length : 0} Selected
                        </span>
                    )}
                </div>
            )}

            <Menu as="div" className={`relative inline-block ${full ? 'w-full' : ''}`}>
                <Menu.Button
                    className={`
                        inline-flex items-center w-full rounded-lg font-medium focus:outline-none focus:ring-none transition duration-150
                        ${
                            className ? className : ''
                        } ${determineColor()} ${displayOnly} ${mode} ${textSize} ${paddingSize} ${withBorder} ${
                        full ? 'w-full' : ''
                    }
                    `}
                >
                    {label ? (
                        label
                    ) : (
                        <span className="inline-flex items-center justify-between w-full">
                            {!multiselect ? selected : 'Select One...'}{' '}
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
                            className={`origin-top-right absolute max-h-72 overflow-y-scroll ${
                                direction === 'left' ? 'right-0' : ''
                            } bg-white mt-2 ${
                                full ? 'w-full' : 'min-w-[180px]'
                            } rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-[999999]`}
                        >
                            <div className={`p-2 flex flex-col gap-1${multiselect ? 'gap-1' : ''}`}>
                                {list &&
                                    list.map((item: any, i) => (
                                        <Menu.Item key={`${item}-${i}`}>
                                            {({ active }) =>
                                                !multiselect ? (
                                                    <div
                                                        className="flex items-center gap-2"
                                                        key={`dropdown-${i}`}
                                                    >
                                                        <MenuItemButton
                                                            label={
                                                                <span className="flex justify-between">
                                                                    {uppercase
                                                                        ? truncate
                                                                            ? _truncate(
                                                                                  item.text.toUpperCase(),
                                                                                  3,
                                                                              )
                                                                            : item.text.toUpperCase()
                                                                        : truncate
                                                                        ? _truncate(item.text, 3)
                                                                        : item.text}
                                                                    {item?.status &&
                                                                    item.status === 'pending' ? (
                                                                        <CgSpinner
                                                                            size="20px"
                                                                            className="animate-spin"
                                                                        />
                                                                    ) : (
                                                                        item?.status && (
                                                                            <IoMdCheckmarkCircle size="20px" />
                                                                        )
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
                                                    <MenuItemButton
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
        </>
    );
};
