import React from 'react';
import { Button } from '../components/buttons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useWindowSize } from '../../hooks/ui';
import { BiPlus } from 'react-icons/bi';
import { useDialogController } from '../../hooks/dialogs';
import { useMyTranchesContext } from '../../store/contexts';
import { useWalletState } from '../../hooks/wallet';
import { Tooltip } from '../components/tooltips';

import { useAccount } from 'wagmi';
interface IDashboardTemplateProps {
    title?: string;
    children?: React.ReactElement | React.ReactElement[];
    description?: string | React.ReactNode;
    view?: string;
    setView?: any;
}

const DashboardTemplate: React.FC<IDashboardTemplateProps> = ({
    title,
    children,
    description,
    view,
    setView,
}) => {
    const { myTranches } = useMyTranchesContext();
    const { openDialog } = useDialogController();
    const location = useLocation();
    const navigate = useNavigate();
    const routeChange = () => navigate(-1);
    const isConnected = useAccount();
    const { width } = useWindowSize();
    const { address } = useWalletState();

    // TODO: cleanup / optimize
    return (
        <div className="max-w-[125rem] mx-auto p-4 md:p-6 lg:p-10">
            <header
                className={`${
                    view ? 'grid grid-flow-dense md:grid-cols-3' : 'flex flex-row'
                } justify-between items-end`}
            >
                <div className="max-w-[500px]">
                    {view ? (
                        <button
                            className="flex gap-2 items-baseline hover:cursor-pointer hover:text-neutral-800 transition duration-150"
                            onClick={routeChange}
                        >
                            <img src="/elements/Vector.svg" alt="vector" className="w-3 h-3" />
                            <p className="text-lg">Back to all</p>
                        </button>
                    ) : (
                        <>
                            <h1 className="text-3xl font-basefont capitalize leading-tight text-gray-900">
                                {title}
                            </h1>
                            {description && <p className="mt-1">{description}</p>}
                        </>
                    )}
                </div>
                {view && (
                    <>
                        <div className="justify-center">
                            <h1 className="text-3xl font-basefont capitalize leading-tight text-gray-900 text-center">
                                {title}
                            </h1>
                        </div>
                        <div className="flex gap-3 md:justify-end mt-2">
                            <Button
                                label="Overview"
                                onClick={() => setView('tranche-overview')}
                                primary={view.includes('overview')}
                                disabled={!isConnected}
                            />
                            <Button
                                label="Details"
                                onClick={() => setView('tranche-details')}
                                primary={view.includes('details')}
                            />
                        </div>
                    </>
                )}
                {location.pathname === `/tranches` && isConnected && (
                    <div className="flex gap-3 md:justify-end mt-2">
                        <Tooltip
                            text="Create a tranche first"
                            disable={myTranches?.length !== 0}
                            content={
                                <Button
                                    label={'My Tranches'}
                                    onClick={() => openDialog('my-tranches-dialog')}
                                    primary
                                    disabled={myTranches?.length === 0}
                                    className="!text-lg"
                                />
                            }
                        />
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
                <div className="py-8 flex flex-col gap-4 md:gap-8">
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
