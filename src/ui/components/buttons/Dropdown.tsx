import React, { Fragment, ReactNode } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { MenuItem } from '../../base';
import { RiArrowDropDownLine } from 'react-icons/ri';
import { CgSpinner } from 'react-icons/cg';
import { IoMdCheckmarkCircle } from 'react-icons/io';

interface IDropdownItem {
    text: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export interface IDropdownProps {
    items: Array<IDropdownItem | any>;
    primary?: boolean;
    border?: boolean;
    direction?: 'left' | 'right';
    size?: 'lg' | 'md';
    selected?: string;
    setSelected?: any;
    label?: string | ReactNode;
}

export const DropdownButton = ({
    items,
    primary,
    direction = 'left',
    size = 'md',
    selected = items && items.length > 0 ? items[0].text : 'Dropdown',
    setSelected = () => {},
    label,
}: IDropdownProps) => {
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

    const mode = primary ? '!text-neutral-100 bg-neutral-800 shadow-lg' : '';

    const textSize = size === 'lg' ? 'text-lg' : 'text-sm';
    const iconSize = size === 'lg' ? '30px' : '24px';
    const paddingSize = size === 'lg' ? 'py-1 pl-4 pr-2' : 'pl-2';
    const displayOnly = label
        ? `lg:border lg:border-1 lg:border-black bg-white ${
              typeof label === 'string' ? '!px-4 !py-[3px]' : '!p-2'
          } !text-lg`
        : '';

    return (
        <Menu as="div" className="relative inline-block">
            <div>
                <Menu.Button
                    className={`
                        inline-flex items-center w-full rounded-lg font-medium focus:outline-none focus:ring-none
                        ${determineColor()} ${displayOnly} ${mode} ${textSize} ${paddingSize}
                    `}
                >
                    {label ? (
                        label
                    ) : (
                        <span className="inline-flex items-center w-full">
                            {selected} <RiArrowDropDownLine size={iconSize} />
                        </span>
                    )}
                </Menu.Button>
            </div>

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
                        className={`origin-top-right absolute ${
                            direction === 'left' ? 'right-0' : ''
                        } bg-white mt-2 min-w-[180px] rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-[999999]`}
                    >
                        <div className="p-2 flex-col">
                            {items.map((item, i) => (
                                <Menu.Item key={`${item}-${i}`}>
                                    {({ active }) => (
                                        <div className="flex items-center gap-2">
                                            <MenuItem
                                                label={item.text}
                                                onClick={
                                                    item.onClick
                                                        ? item.onClick
                                                        : (e: any) =>
                                                              setSelected(e.target.innerText)
                                                }
                                                mobile
                                            />
                                            {item?.status && item.status === 'pending' ? (
                                                <CgSpinner size="24px" className="animate-spin" />
                                            ) : (
                                                <IoMdCheckmarkCircle size="24px" />
                                            )}
                                        </div>
                                    )}
                                </Menu.Item>
                            ))}
                        </div>
                    </Menu.Items>
                </Transition>
            )}
        </Menu>
    );
};
