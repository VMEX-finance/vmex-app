import React, { Fragment } from "react";
import { Menu, Transition } from '@headlessui/react';
import { MenuItem } from "../../base";
import { RiArrowDropDownLine } from "react-icons/ri";

interface IDropdownItem {
    text: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export interface IDropdown {
    items: Array<IDropdownItem>;
    primary?: boolean;
    border?: boolean;
    direction?: 'left' | 'right';
}

export const DropdownButton = ({items, primary, direction = 'left'}: IDropdown) => {
    const [selected, setSelected] = React.useState(items[0].text);

    const determineColor = () => {
        switch(selected) {
            case 'Normal': return 'text-[#C8781B]';
            case 'Low': return 'text-red-300';
            case 'High': return 'text-green-300';
            default: return 'text-neutral-900';
        }
    }

    const mode = primary ? "!text-neutral-100 bg-neutral-800 shadow-lg" : "";

    return (
        <Menu as="div" className="relative inline-block">
            <div>
                <Menu.Button className={`${determineColor()} inline-flex items-center w-full rounded-md py-2 pl-1 pr-3 ${mode} text-sm font-medium focus:outline-none focus:ring-none`}>
                    <RiArrowDropDownLine size="24px" /> {selected}
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
            <Menu.Items className={`origin-top-right absolute ${direction === 'left' ? 'right-0' : ''} mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-[999999]`}>
                <div className="p-2">
                    {items.map((item, i) => (
                        <Menu.Item key={`${item}-${i}`}>
                        {({ active }) => (
                            <MenuItem 
                                label={item.text}
                                onClick={item.onClick ? 
                                    item.onClick : 
                                    (e:any) => setSelected(e.target.innerText)}
                                mobile
                            />
                        )}
                        </Menu.Item>
                    ))}
                </div>
            </Menu.Items>
            </Transition>
        </Menu>
    )
}