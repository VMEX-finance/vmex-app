import React from 'react';
import { Button } from '../components/buttons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useWalletState } from '../../hooks/wallet';
import { useWindowSize } from '../../hooks/ui';
import { BiPlus } from 'react-icons/bi';
import { useDialogController } from '../../hooks/dialogs';

interface IDashboardTemplate {
    title?: string;
    children?: React.ReactElement | React.ReactElement[];
    description?: string | React.ReactNode;
    view?: string;
    setView?: any;
}

const DashboardTemplate: React.FC<IDashboardTemplate> = ({
    title,
    children,
    description,
    view,
    setView,
}) => {
    const { openDialog } = useDialogController();
    const location = useLocation();
    const navigate = useNavigate();
    const routeChange = () => navigate(-1);
    const { address } = useWalletState();
    const { width } = useWindowSize();

    // TODO: cleanup / optimize
    return (
        <div className="py-10 max-w-[120rem] mx-auto px-6 lg:px-8">
            <header
                className={`${
                    view ? 'grid grid-flow-dense md:grid-cols-3' : 'flex flex-row'
                } justify-between items-end`}
            >
                <div className="max-w-[500px]">
                    {view ? (
                        <div
                            className="flex gap-2 items-baseline hover:cursor-pointer"
                            onClick={routeChange}
                        >
                            <img src="/elements/Vector.svg" alt="vector" />
                            <p>Back to all</p>
                        </div>
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
                                disabled={!address}
                            />
                            <Button
                                label="Details"
                                onClick={() => setView('tranche-details')}
                                primary={view.includes('details')}
                            />
                        </div>
                    </>
                )}
                {location.pathname === `/tranches` && address && (
                    <div className="flex gap-3 md:justify-end mt-2">
                        <Button
                            label={'My Tranches'}
                            onClick={() => openDialog('my-tranches-dialog')}
                            primary
                        />
                        <Button
                            label={width > 768 ? 'Create Tranche' : <BiPlus size="24px" />}
                            onClick={() => openDialog('create-tranche-dialog')}
                            primary
                        />
                    </div>
                )}
            </header>
            <main>
                <div className="py-8 flex flex-col gap-8">
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
