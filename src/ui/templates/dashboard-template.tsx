import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useWindowSize, useDialogController } from '../../hooks';
import { BiChevronLeft, BiPlus } from 'react-icons/bi';
import { useMyTranchesContext } from '../../store';
import { Tooltip, Button, LinkButton } from '../components';
import { useAccount } from 'wagmi';
import { Skeleton } from '@mui/material';

interface IDashboardTemplateProps {
    title?: string;
    children?: React.ReactElement | React.ReactElement[];
    description?: string | React.ReactNode;
    view?: string;
    setView?: any;
    titleLoading?: boolean;
}

const DashboardTemplate: React.FC<IDashboardTemplateProps> = ({
    title,
    children,
    description,
    view,
    setView,
    titleLoading,
}) => {
    const { myTranches } = useMyTranchesContext();
    const { openDialog } = useDialogController();
    const location = useLocation();
    const navigate = useNavigate();
    const routeChange = () => navigate(-1);
    const isConnected = useAccount();
    const { width } = useWindowSize();

    // TODO: cleanup / optimize
    return (
        <div className="max-w-[125rem] mx-auto p-3 md:p-6 lg:p-10">
            <header
                className={`${
                    view ? 'grid grid-flow-dense md:grid-cols-3' : 'flex flex-row'
                } justify-between items-end`}
            >
                <div className="max-w-[500px]">
                    {view ? (
                        <LinkButton onClick={routeChange}>
                            <BiChevronLeft size="22px" />
                            <p className="text-lg">Back to all</p>
                        </LinkButton>
                    ) : (
                        <>
                            <h1 className="text-3xl font-basefont capitalize leading-tight text-neutral-900 dark:text-neutral-100">
                                {title}
                            </h1>
                            {description && (
                                <p className="mt-1 dark:text-neutral-100">{description}</p>
                            )}
                        </>
                    )}
                </div>
                {view && (
                    <>
                        <div className="justify-center mx-auto">
                            {titleLoading ? (
                                <Skeleton variant="rounded" height={'36px'} width={'180px'} />
                            ) : (
                                <h1 className="text-3xl font-basefont capitalize leading-tight text-neutral-900 dark:text-neutral-100 text-center">
                                    {title}
                                </h1>
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
                {location.pathname === `/tranches` && isConnected && (
                    <div className="flex gap-3 md:justify-end mt-2">
                        {myTranches?.length > 0 ? (
                            <Button
                                label={'My Tranches'}
                                onClick={() => openDialog('my-tranches-dialog')}
                                primary
                                className="!text-lg"
                            />
                        ) : (
                            <Tooltip
                                text="Create a tranche first"
                                content={
                                    <Button
                                        label={'My Tranches'}
                                        primary
                                        disabled={myTranches?.length === 0}
                                        className="!text-lg"
                                    />
                                }
                            />
                        )}
                        <Button
                            label={width > 768 ? 'Create Tranche' : <BiPlus size="28px" />}
                            onClick={() => openDialog('create-tranche-dialog')}
                            primary
                            className="!text-lg"
                        />
                    </div>
                )}
            </header>
            <main>
                <div className="py-8 flex flex-col gap-4 xl:gap-8">
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
