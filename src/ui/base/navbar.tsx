import { Menu, Transition } from '@headlessui/react';
import { useWindowSize } from '../../hooks/ui';
import React, { Fragment } from 'react';
import { HiOutlineMenuAlt3 } from 'react-icons/hi';
import { BiTransferAlt } from 'react-icons/bi';
import { useLocation, useNavigate } from 'react-router-dom';
import { DropdownButton, MenuItemButton, WalletButton } from '../components/buttons';
import { useTransactionsContext } from '../../store/contexts';
import { useWalletState } from '../../hooks/wallet';
import { CgSpinner } from 'react-icons/cg';

export const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { width } = useWindowSize();
    const { address } = useWalletState();
    const { transactions } = useTransactionsContext();

    function navigateTo(e: any) {
        e.preventDefault();
        let value = e.target.innerText.toLowerCase();
        navigate(`../${value}`, { replace: false });
    }

    const navItems = ['Overview', 'Tranches', 'Markets', 'Staking', 'Governance', 'Develop'];

    return (
        <nav className="flex flex-row sticky h-fit justify-between items-center top-0 font-basefont px-4 py-2 lg:px-6 2xl:px-10 lg:py-5 bg-neutral-900 lg:bg-[#EEEEEE] z-[1000] shadow-lg lg:shadow-none">
            <div
                className={`w-full
                ${width < 1024 ? 'flex flex-row items-center justify-between' : 'grid grid-cols-3'}
            `}
            >
                <a id="nav-logo" href="/">
                    <img
                        src="/VMEX-logo.svg"
                        alt="VMEX Finance Logo"
                        width="100"
                        className="invert lg:invert-0"
                    />
                </a>

                {width > 1024 ? (
                    <div className="justify-self-center">
                        <div
                            className={
                                'grid grid-flow-col auto-cols-max justify-between gap-2 2xl:gap-4 w-max p-[8px] shadow-lg bg-black rounded-2xl'
                            }
                        >
                            {navItems.map((item) => (
                                <MenuItemButton
                                    key={item}
                                    label={item}
                                    selected={location.pathname === `/${item.toLowerCase()}`}
                                    onClick={navigateTo}
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-4">
                        {address && transactions && (
                            <DropdownButton
                                reverse
                                items={transactions}
                                baseLink={`https://etherscan.com`}
                                label={
                                    <span className="flex items-center gap-2">
                                        {width > 1350 ? (
                                            'Transactions'
                                        ) : (
                                            <BiTransferAlt
                                                size={`${width < 1023 ? '28px' : '20px'}`}
                                            />
                                        )}
                                        {
                                            transactions.filter((el) => el.status === 'pending')
                                                .length
                                        }
                                    </span>
                                }
                            />
                        )}
                        <Menu as="div" className="relative inline-block">
                            <div>
                                <Menu.Button className="inline-flex justify-center w-full rounded-md border shadow-sm px-2 md:px-3 py-1 bg-neutral-100 text-sm font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-offset-2">
                                    <HiOutlineMenuAlt3 size="34px" />
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
                                                    <MenuItemButton
                                                        key={item}
                                                        label={item}
                                                        onClick={navigateTo}
                                                        mobile
                                                    />
                                                )}
                                            </Menu.Item>
                                        ))}
                                        <WalletButton
                                            label={'Connect Wallet'}
                                            primary
                                            className="!w-full"
                                        />
                                    </div>
                                </Menu.Items>
                            </Transition>
                        </Menu>
                    </div>
                )}

                {width > 1024 && (
                    <div className="flex items-center justify-end gap-3">
                        {address && transactions && (
                            <DropdownButton
                                reverse
                                items={transactions}
                                baseLink={`https://etherscan.com`}
                                className="max-h-[36px]"
                                label={
                                    <span className="flex items-center gap-2">
                                        {width > 1350 ? `Transactions` : <BiTransferAlt />}
                                        {transactions.filter((el) => el.status === 'pending')
                                            .length > 0 && <CgSpinner className="animate-spin" />}
                                    </span>
                                }
                            />
                        )}
                        <WalletButton label={width > 1200 ? 'Connect Wallet' : 'Connect'} primary />
                    </div>
                )}
            </div>
        </nav>
    );
};
