import { Menu, Transition } from '@headlessui/react';
import React, { Fragment, useContext, useState } from 'react';
import { HiOutlineMenuAlt3 } from 'react-icons/hi';
import { useLocation, useNavigate } from 'react-router-dom';
import { DefaultDropdown, WalletButton, ToggleThemeButton } from '@/ui/components';
import { ThemeContext, IDialogNames } from '@/store';
import { useAccount, useDisconnect, useSwitchNetwork } from 'wagmi';
import { useDialogController, useWindowSize } from '@/hooks';
import { useSubgraphUserData } from '@/api';
import {
    NETWORKS,
    getNetworkName,
    isChainUnsupported,
    renderNetworks,
    truncateAddress,
} from '@/utils';
import { getNetwork } from '@wagmi/core';
import { NavItem } from './nav-item';
import { MdClose } from 'react-icons/md';
import { useChainModal } from '@rainbow-me/rainbowkit';

const navItems = ['Overview', 'Tranches', 'Markets', 'Portfolio', 'Staking'];

const MobileDropdownMenu = ({
    onClick,
    navigate,
    tranches,
}: {
    onClick: (e: IDialogNames, data?: any) => void;
    navigate: any;
    tranches?: any[];
}) => {
    const { address } = useAccount();
    const { disconnect } = useDisconnect();
    const { openChainModal } = useChainModal();
    const [isOpen, setIsOpen] = useState(false);

    const openMenu = () => setIsOpen(true);
    const closeMenu = () => setIsOpen(false);
    const network = getNetworkName();

    return (
        <div className="justify-self-end">
            <button
                onClick={openMenu}
                className={[
                    'dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-100',
                    'px-2 md:px-3 py-1',
                    'flex my-auto justify-center w-full rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-0',
                    'bg-neutral-800 hover:bg-neutral-700 text-neutral-100 lg:bg-neutral-300 lg:hover:bg-[rgb(200,200,200)]',
                ].join(' ')}
            >
                <HiOutlineMenuAlt3 size="27px" />
            </button>
            <Transition
                show={isOpen}
                enter="transform transition ease-in-out duration-500"
                enterFrom="translate-x-[100vw]"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-[100vw]"
                className="fixed z-30 h-screen right-0 top-0"
            >
                <div className="w-56 flex flex-col h-full bg-white dark:bg-brand-black shadow-md z-50 p-2 items-end text-right justify-between">
                    <div className="flex flex-col w-full">
                        <button
                            onClick={closeMenu}
                            className="inline-flex p-2 self-end rounded-md text-sm font-medium text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-purple"
                        >
                            <MdClose size="27px" />
                        </button>
                        <ul className="flex flex-col gap-0.5 w-full">
                            {navItems.map((item, i) => (
                                <li key={`${item}-${i}`}>
                                    <button
                                        onClick={(e) => {
                                            closeMenu();
                                            navigate(e);
                                        }}
                                        className="uppercase dark:text-neutral-100 pr-4 py-1 text-lg font-medium"
                                    >
                                        {item}
                                    </button>
                                </li>
                            ))}
                            {!address && <WalletButton />}
                        </ul>
                    </div>
                    <ul className="flex flex-col gap-0.5 justify-end items-end self-end w-full mb-12">
                        {address && (
                            <>
                                <li className="w-full">
                                    <button className="uppercase dark:text-neutral-100 px-4 py-1 text-lg font-medium border-y-2 border-gray-300 dark:border-gray-700 w-full flex items-center justify-between">
                                        <img src={NETWORKS[network].icon} width="24" height="24" />
                                        {truncateAddress(address)}
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className="uppercase dark:text-neutral-100 pr-4 py-1 text-lg font-medium"
                                        onClick={() => onClick('transactions-dialog')}
                                    >
                                        TX History
                                    </button>
                                </li>
                                {tranches?.length !== 0 && (
                                    <li>
                                        <button
                                            className="uppercase dark:text-neutral-100 pr-4 py-1 text-lg font-medium"
                                            onClick={() => navigate('my-tranches')}
                                        >
                                            My Tranches
                                        </button>
                                    </li>
                                )}
                                <li>
                                    <button
                                        className="flex items-center gap-2 uppercase dark:text-neutral-100 pr-4 py-1 text-lg font-medium"
                                        onClick={() => openChainModal && openChainModal()}
                                    >
                                        Switch Chain
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className="uppercase text-red-600 dark:text-red-400 pr-4 py-1 text-lg font-medium"
                                        onClick={() => disconnect()}
                                    >
                                        Disconnect
                                    </button>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </Transition>
            <Transition
                show={isOpen}
                enter="transform transition ease-in-out duration-500"
                enterFrom="-translate-x-[100vw]"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-[100vw]"
                className="fixed z-20 h-screen right-0 top-0"
            >
                <div className="w-screen h-full bg-[rgba(0,0,0,0.25)]" onClick={closeMenu} />
            </Transition>
        </div>
    );
};

export const Navbar: React.FC = () => {
    const { isDark } = useContext(ThemeContext);
    const navigate = useNavigate();
    const location = useLocation();
    const { width, breakpoints } = useWindowSize();
    const { openDialog } = useDialogController();
    const { address } = useAccount();
    const { queryTrancheAdminData } = useSubgraphUserData(address || '');
    const { switchNetworkAsync, switchNetwork } = useSwitchNetwork();

    function navigateTo(e: any, text?: string) {
        if (text && text === 'Portfolio' && switchNetwork && isChainUnsupported()) switchNetwork();
        if (typeof e === 'string') navigate(`../${e}`, { replace: false });
        else {
            e.preventDefault();
            let value = e.target.innerText?.toLowerCase();
            navigate(`../${value}`, { replace: false });
        }
    }

    function renderChainImg() {
        if (isChainUnsupported() || !address) return 'coins/op.svg';
        else {
            return renderNetworks().filter(
                (network) => network.text === getNetwork()?.chain?.network,
            )[0]?.icon;
        }
    }

    return (
        <nav className="flex justify-center flex-row sticky h-fit items-center top-0 font-basefont px-2 lg:px-4 py-1.5 md:py-2 2xl:py-2.5 2xl:px-6 bg-neutral-900 dark:bg-brand-black lg:bg-white z-[1000] shadow-md shadow-gray-300 dark:shadow-neutral-950">
            <div
                className={`w-full max-w-[125rem]
                ${
                    width <= breakpoints.lg
                        ? 'flex flex-row items-center justify-between'
                        : 'grid grid-cols-3'
                }
            `}
            >
                {/* Desktop/Mobile Left Nav */}
                <div className="flex items-center gap-4 xl:gap-6">
                    <button onClick={() => navigateTo('overview')}>
                        <a id="nav-logo" className="flex items-center gap-2">
                            <img
                                src={
                                    isDark && width >= 1024
                                        ? '/VMEX-logo-white.svg'
                                        : '/VMEX-logo.svg'
                                }
                                alt="VMEX Finance Logo"
                                width="72"
                                height="42.66"
                                className="invert lg:invert-0"
                            />
                        </a>
                    </button>
                </div>

                {/* Desktop Center Nav */}
                {width >= breakpoints.lg && (
                    <div className="justify-self-center">
                        <div
                            className={
                                'grid grid-flow-col auto-cols-max justify-between gap-1 w-max p-1 shadow-[0px_0px_4px_0px_rgba(0,0,0,0.75)_inset] shadow-neutral-400 dark:shadow-black bg-[rgb(240,240,240)] dark:bg-[rgba(20,20,20)] rounded-xl'
                            }
                        >
                            {navItems.map((item) => (
                                <NavItem
                                    key={item}
                                    label={item}
                                    selected={location.pathname === `/${item?.toLowerCase()}`}
                                    onClick={(e: any) => navigateTo(e, item)}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Desktop/Mobile Right Nav */}
                <div className="flex items-center justify-end gap-1">
                    <ToggleThemeButton />
                    {width < breakpoints.lg && !address ? (
                        <WalletButton>{width > 1200 ? 'Connect Wallet' : 'Connect'}</WalletButton>
                    ) : (
                        <DefaultDropdown
                            selected={renderChainImg()}
                            items={renderNetworks(switchNetworkAsync)}
                            size="lg"
                            icon
                            className="!bg-neutral-800 hover:!bg-neutral-700 !text-neutral-100 lg:!bg-neutral-300 lg:hover:!bg-[rgb(200,200,200)] lg:!text-black dark:lg:!bg-neutral-800 dark:lg:hover:!bg-neutral-700 dark:lg:!text-neutral-100"
                        />
                    )}

                    {width >= breakpoints.lg ? (
                        <WalletButton>{width > 1200 ? 'Connect Wallet' : 'Connect'}</WalletButton>
                    ) : (
                        <MobileDropdownMenu
                            onClick={openDialog}
                            navigate={navigateTo}
                            tranches={queryTrancheAdminData?.data}
                        />
                    )}
                </div>
            </div>
        </nav>
    );
};
