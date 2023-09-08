import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useWindowSize, useDialogController } from '@/hooks';
import { BiChevronLeft, BiPlus } from 'react-icons/bi';
import { Tooltip, Button, LinkButton, SkeletonLoader, Label } from '../components';
import { useAccount, useNetwork } from 'wagmi';
import { Skeleton } from '@mui/material';
import { useSubgraphUserData } from '@/api';
import { useSelectedTrancheContext } from '@/store';
import { getNetwork } from '@wagmi/core';
import { DEFAULT_NETWORK } from '@/utils';

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
    const { openDialog } = useDialogController();
    const location = useLocation();
    const navigate = useNavigate();
    const routeChange = () => navigate(-1);
    const isConnected = useAccount();
    const { width } = useWindowSize();
    const { address } = useAccount();
    const { queryTrancheAdminData } = useSubgraphUserData(address || '');
    const { tranche } = useSelectedTrancheContext();

    const network = getNetwork()?.chain?.unsupported
        ? DEFAULT_NETWORK
        : getNetwork()?.chain?.name?.toLowerCase() || DEFAULT_NETWORK;

    // TODO: cleanup / optimize
    return (
        <div className="max-w-[125rem] mx-auto p-3 md:p-4 lg:p-5 xl:p-6 2xl:px-10">
            <header
                className={`
                    ${right ? 'flex justify-between w-full' : ''}
                    ${view && !right ? 'grid grid-flow-dense md:grid-cols-3' : 'flex flex-row'}
                justify-between items-end`}
            >
                <div className="max-w-[500px]">
                    {view ? (
                        <LinkButton onClick={routeChange}>
                            <BiChevronLeft size="22px" />
                            <p className="text-lg">Back</p>
                        </LinkButton>
                    ) : (
                        <>
                            <h1 className="text-3xl font-basefont capitalize leading-tight text-neutral-900 dark:text-neutral-300">
                                {title}
                            </h1>
                            {(description || descriptionLoading) && (
                                <div className="mt-1">
                                    {descriptionLoading ? (
                                        <SkeletonLoader height="24px" />
                                    ) : (
                                        <p className="dark:text-neutral-300">{description}</p>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
                {right && right}
                {view && !right && (
                    <>
                        <div className="justify-center mx-auto">
                            {titleLoading ? (
                                <Skeleton variant="rounded" height={'36px'} width={'180px'} />
                            ) : (
                                <div className="flex flex-col items-center justify-center">
                                    <div className="flex flex-row gap-3 items-center md:flex-col md:gap-0">
                                        <h1 className="text-3xl font-basefont capitalize leading-tight text-neutral-900 dark:text-neutral-300 text-center">
                                            {title}
                                        </h1>
                                        {tranche?.category && (
                                            <Label
                                                tooltip
                                                className="!py-0.5 !text-xs md:absolute md:left-1/2 md:-translate-x-1/2"
                                            >
                                                {tranche?.category || 'Unknown'}
                                            </Label>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="flex gap-3 md:justify-end">
                            <LinkButton
                                onClick={() => setView('tranche-overview')}
                                disabled={!isConnected}
                                className="text-lg px-1"
                                highlight={view.includes('tranche-overview')}
                            >
                                Supply/Borrow
                            </LinkButton>
                            <LinkButton
                                onClick={() => setView('tranche-details')}
                                disabled={!isConnected}
                                className="text-lg px-1"
                                highlight={view.includes('tranche-details')}
                            >
                                Details
                            </LinkButton>
                        </div>
                    </>
                )}
                {(location.pathname === `/tranches` || location.pathname === '/portfolio') &&
                    isConnected &&
                    !chain?.unsupported && (
                        <div className="flex gap-2 xl:gap-3 md:justify-end">
                            {queryTrancheAdminData.data?.length &&
                            queryTrancheAdminData.data?.length > 0 ? (
                                <Button
                                    label={'My Tranches'}
                                    onClick={() => navigate(`/my-tranches`)}
                                    primary
                                    className="h-full sm:h-auto"
                                />
                            ) : (
                                <Tooltip text="Create a tranche first" position="left">
                                    <Button
                                        label={'My Tranches'}
                                        primary
                                        disabled={queryTrancheAdminData?.data?.length === 0}
                                        className="h-full sm:h-auto"
                                    />
                                </Tooltip>
                            )}
                            {/* TODO: enable for OP when backend enables creating tranches */}
                            <Tooltip text="Coming soon">
                                <Button
                                    label={width > 768 ? 'Create Tranche' : <BiPlus size="28px" />}
                                    onClick={() => openDialog('create-tranche-dialog')}
                                    primary
                                    disabled
                                />
                            </Tooltip>
                        </div>
                    )}
            </header>
            <main>
                <div className="py-4 md:py-8 flex flex-col gap-4">
                    {children ? (
                        children
                    ) : (
                        <div className="border-4 border-dashed border-gray-200 rounded-lg h-96" />
                    )}
                </div>
            </main>
        </div>
    );
};

export { DashboardTemplate };
