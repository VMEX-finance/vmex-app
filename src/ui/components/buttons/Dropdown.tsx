import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { MenuItem } from '../../base';
import { RiArrowDropDownLine } from 'react-icons/ri';

interface IDropdownItem {
    text: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export interface IDropdown {
    items: Array<IDropdownItem>;
    primary?: boolean;
    border?: boolean;
    direction?: 'left' | 'right';
    size?: 'lg' | 'md';
}

export const DropdownButton = ({ items, primary, direction = 'left', size = 'md' }: IDropdown) => {
    // TODO: reconfigure this component to accept a selected state and a setSelected state to allow it to change higher components
    const [selected, setSelected] = React.useState(items[0].text);

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

    return (
        <Menu as="div" className="relative inline-block">
            <div>
                <Menu.Button
                    className={`${determineColor()} inline-flex items-center w-full rounded-md ${mode} ${textSize} ${paddingSize} font-medium focus:outline-none focus:ring-none`}
                >
                    {selected} <RiArrowDropDownLine size={iconSize} />
                </Menu.Button>
            </div>

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
                    } bg-white mt-2 whitespace-nowrap min-w-[180px] rounded-md shadow-lg ${mode} ring-1 ring-black ring-opacity-5 focus:outline-none z-[999999]`}
                >
                    <div className="p-2">
                        {items.map((item, i) => (
                            <Menu.Item key={`${item}-${i}`}>
                                {({ active }) => (
                                    <MenuItem
                                        label={item.text}
                                        onClick={
                                            item.onClick
                                                ? item.onClick
                                                : (e: any) => setSelected(e.target.innerText)
                                        }
                                        mobile
                                    />
                                )}
                            </Menu.Item>
                        ))}
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    );
};
