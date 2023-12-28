import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useWindowSize, useDialogController } from '@/hooks';
import { BiChevronLeft, BiPlus } from 'react-icons/bi';
import { Tooltip, Button, Loader, Label, MessageStatus } from '../components';
import { useAccount, useNetwork } from 'wagmi';
import { Skeleton } from '@mui/material';
import { usePricesData, useSubgraphUserData } from '@/api';
import { useSelectedTrancheContext } from '@/store';
import { Transition } from '@headlessui/react';
import { isChainUnsupported } from '@/utils';

interface IDashboardTemplateProps {
    title?: string;
    children?: React.ReactElement | React.ReactElement[];
    description?: string | React.ReactNode;
    view?: string;
    setView?: any;
    titleLoading?: boolean;
    right?: React.ReactNode;
    descriptionLoading?: boolean;
}

const DashboardTemplate: React.FC<IDashboardTemplateProps> = ({
    title,
    children,
    description,
    view,
    setView,
    titleLoading,
    right,
    descriptionLoading,
}) => {
    const { chain } = useNetwork();
    const { isError } = usePricesData();
    const { openDialog } = useDialogController();
    const location = useLocation();
    const navigate = useNavigate();
    const routeChange = () => navigate(-1);
    const isConnected = useAccount();
    const { width } = useWindowSize();
    const { address } = useAccount();
    const { queryTrancheAdminData } = useSubgraphUserData(address || '');
    const { tranche } = useSelectedTrancheContext();

    return (
        <>
            <div className="max-w-[125rem] mx-auto p-2 pt-3 pb-6 md:p-4 md:pb-6 2xl:pt-5 2xl:px-6">
                <header
                    className={`
                    ${right ? 'flex justify-between w-full' : ''}
                    ${
                        view && !right
                            ? 'flex md:grid md:grid-flow-dense md:grid-cols-3'
                            : 'flex flex-row'
                    }
                justify-between items-end`}
                >
                    <div className="flex flex-col">
                        {view ? (
                            <div className="flex flex-col md:flex-row justify-between md:justify-start md:items-center gap-3">
                                <Button onClick={routeChange} type="selected">
                                    <BiChevronLeft size="20px" />
                                    <p className="2xl:text-lg leading-tight">Back</p>
                                </Button>
                                <Label
                                    tooltip
                                    className={`${!title ? 'animate-pulse' : ''} mb-1 ml-1 md:m-0`}
                                >
                                    {tranche?.category || 'Loading'}
                                </Label>
                            </div>
                        ) : (
                            <>
                                <h1 className="text-[26px] 2xl:text-3xl font-basefont capitalize leading-tight text-neutral-900 dark:text-neutral-300">
                                    {title}
                                </h1>
                                {(description || descriptionLoading) && (
                                    <div className="mt-1">
                                        {descriptionLoading ? (
                                            <Loader height="24px" type="skeleton" />
                                        ) : (
                                            <span className="dark:text-neutral-300">
                                                {description}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                    {right && right}
                    {view && !right && (
                        <>
                            <div className="flex flex-col items-end">
                                <div className="justify-center md:mx-auto">
                                    {titleLoading ? (
                                        <Skeleton
                                            variant="rounded"
                                            height={'36px'}
                                            width={'180px'}
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="flex flex-row-reverse gap-3 items-center justify-end md:flex-col md:gap-0">
                                                <h1 className="text-2xl font-basefont capitalize leading-tight text-neutral-900 dark:text-neutral-300 text-right">
                                                    {title}
                                                </h1>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-1.5 2xl:gap-2 md:hidden">
                                    <Button
                                        type="selected"
                                        onClick={() => setView('tranche-overview')}
                                        disabled={!isConnected}
                                        className="2xl:text-lg px-1"
                                        // highlight={view.includes('tranche-overview')}
                                    >
                                        Supply/Borrow
                                    </Button>
                                    <Button
                                        type="selected"
                                        onClick={() => setView('tranche-details')}
                                        disabled={!isConnected}
                                        className="2xl:text-lg px-1"
                                        // highlight={view.includes('tranche-details')}
                                    >
                                        Details
                                    </Button>
                                </div>
                            </div>
                            <div className="gap-1.5 2xl:gap-2 hidden md:flex justify-end">
                                <Button
                                    type="selected"
                                    onClick={() => setView('tranche-overview')}
                                    disabled={!isConnected}
                                    className="2xl:text-lg px-1"
                                    highlight={view.includes('tranche-overview')}
                                >
                                    Supply/Borrow
                                </Button>
                                <Button
                                    type="selected"
                                    onClick={() => setView('tranche-details')}
                                    disabled={!isConnected}
                                    className="2xl:text-lg px-1"
                                    highlight={view.includes('tranche-details')}
                                >
                                    Details
                                </Button>
                            </div>
                        </>
                    )}
                    {(location.pathname === `/tranches` || location.pathname === '/portfolio') &&
                        isConnected &&
                        !isChainUnsupported() && (
                            <div className="flex gap-1 2xl:gap-1.5 items-center md:justify-end">
                                {queryTrancheAdminData.data?.length &&
                                queryTrancheAdminData.data?.length > 0 ? (
                                    <Button onClick={() => navigate(`/my-tranches`)}>
                                        My Tranches
                                    </Button>
                                ) : (
                                    <Tooltip text="Create a tranche first" position="left">
                                        <Button
                                            disabled={queryTrancheAdminData?.data?.length === 0}
                                        >
                                            My Tranches
                                        </Button>
                                    </Tooltip>
                                )}
                                {/* TODO: enable for OP when backend enables creating tranches */}
                                <Tooltip text="Coming soon">
                                    <Button
                                        onClick={() => openDialog('create-tranche-dialog')}
                                        disabled
                                        icon={width > 1024 && <BiPlus />}
                                    >
                                        {width > 768 ? 'Create Tranche' : 'Create'}
                                    </Button>
                                </Tooltip>
                            </div>
                        )}
                </header>
                <main>
                    <div className="pb-3 pt-1.5 md:pt-2 flex flex-col gap-2 2xl:gap-3">
                        {children ? (
                            children
                        ) : (
                            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96" />
                        )}
                    </div>
                </main>
            </div>

            <Transition
                show={isError}
                enter="transition-opacity duration-200"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                className="fixed left-0 bottom-0 z-[999] w-full"
            >
                <div className="flex justify-center w-full bg-white dark:bg-brand-background py-1 lg:py-1.5 border-t-2 border-yellow-400">
                    <MessageStatus
                        type="warning"
                        message="Error getting oracle prices. Proceed with caution."
                    />
                </div>
            </Transition>
        </>
    );
};

export { DashboardTemplate };
