import React from 'react';
import { Button } from '../components/buttons';
import { useNavigate } from 'react-router-dom';

interface IDashboardTemplate {
    title?: string;
    hero?: React.ReactElement;
    children?: React.ReactElement | React.ReactElement[];
    description?: string | React.ReactNode;
    view?: string;
    setView?: any;
}

const DashboardTemplate: React.FC<IDashboardTemplate> = ({
    title,
    hero,
    children,
    description,
    view,
    setView,
}) => {
    const navigate = useNavigate();
    const routeChange = () => navigate(-1);

    return (
        <div className="py-10 max-w-[120rem] mx-auto px-6 lg:px-8">
            <header className="flex flex-row justify-between items-end">
                <div className="max-w-[500px]">
                    {view && (
                        <div
                            className="flex gap-2 items-baseline hover:cursor-pointer"
                            onClick={routeChange}
                        >
                            <img src="/elements/Vector.svg" alt="vector" />
                            <p>Back to all</p>
                        </div>
                    )}
                    <h1 className="text-3xl font-basefont capitalize leading-tight text-gray-900">
                        {title}
                    </h1>
                    {description && <p className="mt-1">{description}</p>}
                </div>
                {view && (
                    <div className="flex gap-3">
                        <Button
                            label="Overview"
                            // TODO: change to push tranche to state
                            onClick={() => setView('tranche-overview')}
                            primary={view.includes('overview')}
                        />
                        <Button
                            label="Details"
                            // TODO: change to push tranche to state
                            onClick={() => setView('tranche-details')}
                            primary={view.includes('details')}
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
