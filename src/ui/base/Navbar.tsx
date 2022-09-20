import { Menu, Transition } from "@headlessui/react";
import { useWindowSize } from "../../hooks/ui";
import React, { Fragment } from "react";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { useLocation, useNavigate } from "react-router-dom";
import { WalletButton } from "../components/buttons";

export interface NavbarInterface {
    defaultPage?: string
    children?: React.ReactElement[]
}

export interface IMenuItems {
    label: string;
    selected?: boolean;
    onClick?: (e: any) => void;
    mobile?: boolean;
}


export const MenuItem = ({label, selected, onClick, mobile}: IMenuItems) => {
    const mode = selected && !mobile ? "!bg-white !text-black" : mobile ? "hover:!bg-neutral-200" : "bg-black text-white ";

    return (
        <button 
            className={["w-full px-4 py-2 rounded-lg transition duration-200 hover:bg-neutral-700", mode].join(" ")}
            onClick={onClick}
        >
            {label}
        </button>
    )
}

export const Navbar = ({children, defaultPage}: NavbarInterface) => {
    return (
        <div className={["grid grid-flow-col auto-cols-max justify-between gap-4 w-max p-[8px] shadow-lg", "bg-black rounded-2xl"].join(" ")}>
            {
                children
            }
        </div>
    )
}

export const DashboardNavbar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { width } = useWindowSize();

    function navigateTo(e: any) {
        e.preventDefault();
        console.log(e)
        let value = e.target.innerText.toLowerCase();
        navigate(`../${value}`, { replace: false });
    };

    const navItems = ["Supply", "Borrow", "Stake", "Markets", "Governance", "Develop"];

    return (
        <nav className="flex flex-row sticky h-fit justify-between items-center top-0 font-basefont px-4 py-2 md:px-10 md:py-5 bg-[#EEEEEE] z-50">
            <div className={`w-full
                ${width < 1024 ? 
                    'flex flex-row items-center justify-between' : 
                    'grid grid-cols-3'
                }
            `}>
                <div id="nav-logo" className="max-w-[100px]">
                    <img 
                        src="/VMEX-logo.svg" 
                        alt="VMEX Finance Logo"
                    />
                </div>

                {width > 1024 ? (
                    <div className="justify-self-center">
                        <Navbar>
                            {navItems.map((item) => (
                                <MenuItem 
                                    key={item}
                                    label={item}
                                    selected={location.pathname === `/${item.toLowerCase()}`}
                                    onClick={navigateTo}
                                />
                            ))}
                        </Navbar>
                    </div>
                ) : (
                    <Menu as="div" className="relative inline-block">
                        <div>
                            <Menu.Button className="inline-flex justify-center w-full rounded-md border shadow-sm px-3 py-2 bg-neutral-800 text-sm font-medium text-neutral-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple">
                                <HiOutlineMenuAlt3 size="28px" />
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
                        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="p-2">
                                {navItems.map((item, i) => (
                                    <Menu.Item key={`${item}-${i}`}>
                                    {({ active }) => (
                                        <MenuItem 
                                            key={item}
                                            label={item}
                                            onClick={navigateTo}
                                            mobile
                                        />
                                    )}
                                    </Menu.Item>
                                ))}
                                <WalletButton label={"Connect Wallet"} primary className="!w-full" />
                            </div>
                        </Menu.Items>
                        </Transition>
                    </Menu>
                )}
                
                {width > 1024 && <div className="flex items-center justify-end"><WalletButton label={width > 1200 ? "Connect Wallet" : "Connect"} primary /></div>}    
            </div>        
        </nav>
    )
}