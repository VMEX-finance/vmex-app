import { Menu, Transition } from '@headlessui/react';
import React, { Fragment, useContext } from 'react';
import { HiOutlineMenuAlt3 } from 'react-icons/hi';
import { useLocation, useNavigate } from 'react-router-dom';
import { DefaultDropdown, MenuItemButton, WalletButton, ToggleThemeButton } from '@/ui/components';
import { ThemeContext, IDialogNames } from '@/store';
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi';
import { useDialogController, useWindowSize } from '@/hooks';
import { useSubgraphUserData } from '@/api';
import { renderNetworks } from '@/utils';
import { getNetwork } from '@wagmi/core';

const navItems = ['Overview', 'Tranches', 'Markets', 'Portfolio', 'Governance'];

export const Navbar: React.FC = () => {
    const { isDark } = useContext(ThemeContext);
    const navigate = useNavigate();
    const location = useLocation();
    const { width, breakpoints } = useWindowSize();
    const { isConnected } = useAccount();
    const { openDialog } = useDialogController();
    const { address } = useAccount();
    const { queryTrancheAdminData } = useSubgraphUserData(address || '');
    const { switchNetworkAsync, switchNetwork } = useSwitchNetwork();
    const { chain } = useNetwork();

    function navigateTo(e: any, text: string) {
        if (text === 'Portfolio' && switchNetwork && chain?.unsupported) switchNetwork();
        if (typeof e === 'string') navigate(`../${e}`, { replace: false });
        else {
            e.preventDefault();
            let value = e.target.innerText?.toLowerCase();
            navigate(`../${value}`, { replace: false });
        }
    }

    function renderChainImg() {
        if (getNetwork()?.chain?.unsupported || !address) return 'coins/op.svg';
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
                    <a id="nav-logo" className="flex items-center gap-2" href="/">
                        <img
                            src={
                                isDark && width >= 1024 ? '/VMEX-logo-white.svg' : '/VMEX-logo.svg'
                            }
                            alt="VMEX Finance Logo"
                            width="72"
                            height="42.66"
                            className="invert lg:invert-0"
                        />
                    </a>
                </div>

                {/* Desktop Center Nav */}
                {width >= breakpoints.lg && (
                    <div className="justify-self-center">
                        <div
                            className={
                                'grid grid-flow-col auto-cols-max justify-between gap-1 w-max p-1 shadow-[0px_0px_4px_0px_rgba(0,0,0,0.75)_inset] shadow-neutral-400 dark:shadow-black bg-[rgb(240,240,240)] dark:bg-[rgba(30,30,30)] rounded-xl'
                            }
                        >
                            {navItems.map((item) => (
                                <MenuItemButton
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
                    <DefaultDropdown
                        selected={renderChainImg()}
                        items={renderNetworks(switchNetworkAsync)}
                        size="lg"
                        icon
                        className="!bg-neutral-800 hover:!bg-neutral-700 !text-neutral-100 lg:!bg-neutral-300 lg:hover:!bg-[rgb(200,200,200)] lg:!text-black dark:lg:!bg-neutral-800 dark:lg:hover:!bg-neutral-700 dark:lg:!text-neutral-100"
                    />

                    {width >= breakpoints.lg ? (
                        <WalletButton primary label={width > 1200 ? 'Connect Wallet' : 'Connect'} />
                    ) : (
                        <MobileDropdownMenu
                            onClick={openDialog}
                            navigate={navigateTo}
                            isConnected={isConnected}
                            tranches={queryTrancheAdminData?.data}
                        />
                    )}
                </div>
            </div>
        </nav>
    );
};

const MobileDropdownMenu = ({
    onClick,
    navigate,
    isConnected,
    tranches,
}: {
    onClick: (e: IDialogNames, data?: any) => void;
    navigate: any;
    isConnected: boolean;
    tranches?: any[];
}) => {
    return (
        <Menu as="div" className="relative inline-block my-auto">
            <div>
                <Menu.Button
                    className={[
                        'dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-100',
                        'px-2 md:px-3 py-1',
                        'flex my-auto justify-center w-full rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-0',
                        'bg-neutral-800 hover:bg-neutral-700 text-neutral-100 lg:bg-neutral-300 lg:hover:bg-[rgb(200,200,200)]',
                    ].join(' ')}
                >
                    <HiOutlineMenuAlt3 size="27px" />
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
                        {navItems.map((item: string, i: number) => (
                            <Menu.Item key={`${item}-${i}`}>
                                <MenuItemButton key={item} label={item} onClick={navigate} mobile />
                            </Menu.Item>
                        ))}
                        <div className="flex flex-col justify-center gap-1 border-2 border-neutral-800 rounded-xl mt-1">
                            <WalletButton
                                primary
                                className="border-0 !bg-neutral-900 !rounded-b-none !text-white hover:!bg-neutral-800"
                            />
                            {isConnected && (
                                <>
                                    <MenuItemButton label={`Portfolio`} onClick={navigate} mobile />
                                    {/* WEN: uncomment when backend enables creating tranches */}
                                    {/* <MenuItemButton
                                        label={`Create Tranche`}
                                        onClick={() => onClick('create-tranche-dialog')}
                                        mobile
                                    /> */}
                                    <MenuItemButton
                                        label={`History`}
                                        onClick={() => onClick('transactions-dialog')}
                                        mobile
                                    />
                                    {tranches?.length !== 0 && (
                                        <MenuItemButton
                                            label={`My Tranches`}
                                            onClick={() => navigate('my-tranches')}
                                            mobile
                                        />
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    );
};
