import { Menu, Transition } from '@headlessui/react';
import { useWindowSize } from '../../hooks/ui';
import React, { Fragment, useContext } from 'react';
import { HiOutlineMenuAlt3 } from 'react-icons/hi';
import { BiTransferAlt } from 'react-icons/bi';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    DropdownButton,
    MenuItemButton,
    WalletButton,
    ToggleThemeButton,
} from '../components/buttons';
import { ThemeContext, useMyTranchesContext, useTransactionsContext } from '../../store/contexts';
import { useAccount } from 'wagmi';
import { useDialogController } from '../../hooks/dialogs/useDialogController';
import { IDialogNames } from '@store/modals';

const navItems = ['Overview', 'Tranches', 'Markets', 'Staking', 'Governance', 'Develop'];

export const Navbar: React.FC = () => {
    const { isDark } = useContext(ThemeContext);
    const navigate = useNavigate();
    const location = useLocation();
    const { width } = useWindowSize();
    const { isConnected } = useAccount();
    const { transactions } = useTransactionsContext();
    const { myTranches } = useMyTranchesContext();
    const { openDialog } = useDialogController();

    function navigateTo(e: any) {
        e.preventDefault();
        let value = e.target.innerText.toLowerCase();
        navigate(`../${value}`, { replace: false });
    }

    return (
        <nav className="flex justify-center flex-row sticky h-fit items-center top-0 font-basefont px-4 py-2 lg:px-6 2xl:px-10 lg:py-5 bg-neutral-900 dark:bg-black lg:bg-[#FFF] dark:lg:bg-black z-[1000] shadow-lg lg:shadow-md">
            <div
                className={`w-full max-w-[150rem]
                ${width <= 1080 ? 'flex flex-row items-center justify-between' : 'grid grid-cols-3'}
            `}
            >
                {/* Desktop/Mobile Left Nav */}
                <a id="nav-logo" href="/">
                    <img
                        src={isDark ? '/VMEX-logo-white.svg' : '/VMEX-logo.svg'}
                        alt="VMEX Finance Logo"
                        width="100"
                        className="invert lg:invert-0"
                    />
                </a>

                {/* Desktop Center Nav */}
                {width >= 1024 && (
                    <div className="justify-self-center">
                        <div
                            className={
                                'grid grid-flow-col auto-cols-max justify-between gap-2 2xl:gap-4 w-max p-2 shadow-neutral-500 shadow-inner dark:shadow-none bg-black dark:bg-neutral-800 rounded-2xl'
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
                )}

                {/* Desktop/Mobile Right Nav */}
                <div className="flex items-center justify-end gap-3">
                    {width <= 1024 && <ToggleThemeButton />}
                    {/* Transactions Dropdown */}
                    {isConnected && transactions && transactions.length !== 0 && (
                        <DropdownButton
                            reverse
                            items={transactions}
                            baseLink={`https://etherscan.io/tx`}
                            selected={'Transactions'}
                            label={
                                width < 1400 && (
                                    <span className="flex gap-2 items-center !max-h-[25px]">
                                        <BiTransferAlt size={'24px'} />
                                        {
                                            transactions.filter((el) => el.status === 'pending')
                                                .length
                                        }
                                    </span>
                                )
                            }
                            size="lg"
                            className={`border border-1 border-black ${
                                width < 1400 ? '!py-[0.45rem]' : ''
                            }`}
                            truncate
                        />
                    )}

                    {width >= 1024 ? (
                        <WalletButton primary label={width > 1200 ? 'Connect Wallet' : 'Connect'} />
                    ) : (
                        <MobileDropdownMenu
                            onClick={openDialog}
                            navigate={navigateTo}
                            isConnected={isConnected}
                            tranches={myTranches}
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
    tranches: any[];
}) => (
    <Menu as="div" className="relative inline-block">
        <div>
            <Menu.Button className="inline-flex justify-center w-full rounded-md border shadow-sm px-2 md:px-3 py-1 bg-neutral-100 text-sm font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-offset-2">
                <HiOutlineMenuAlt3 size="30px" />
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
                            {({ active }) => (
                                <MenuItemButton key={item} label={item} onClick={navigate} mobile />
                            )}
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
                                <MenuItemButton
                                    label={`Create Tranche`}
                                    onClick={() => onClick('create-tranche-dialog')}
                                    mobile
                                />
                                {tranches?.length !== 0 && (
                                    <MenuItemButton
                                        label={`My Tranches`}
                                        onClick={() => onClick('my-tranches-dialog')}
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
