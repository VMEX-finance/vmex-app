import React from 'react';
import { Button } from '../components/buttons';
import { useNavigate } from 'react-router-dom';

interface IDashboardTemplate {
    title?: string;
    hero?: React.ReactElement;
    children?: React.ReactElement | React.ReactElement[];
    description?: string | React.ReactNode;
    back?: any;
    overview?: any;
}

const DashboardTemplate: React.FC<IDashboardTemplate> = ({
    title,
    hero,
    children,
    description,
    back,
    overview,
}) => {
    const navigate = useNavigate();
    const routeChange = () => {
        let path = '/tranches';
        navigate(path);
    };
    return (
        <div className="py-10">
            <header className="flex flex-row justify-between">
                <div className="mx-32">
                    <div className="max-w-[500px] sm:px-6 lg:px-8">
                        {back && (
                            <div
                                className="flex flex-row gap-1 hover:font-medium hover:cursor-pointer"
                                onClick={routeChange}
                            >
                                <img src="elements/Vector.svg" alt="vector" />
                                <p>Back to all</p>
                            </div>
                        )}
                        <h1 className="text-3xl font-basefont capitalize leading-tight text-gray-900">
                            {title}
                        </h1>
                        {description && <p className="mt-1">{description}</p>}
                    </div>
                </div>
                {back &&
                    (overview ? (
                        <div className="mx-40 mt-12">
                            <Button
                                label="Overview"
                                primary
                                className="mx-1 rounded-sm w-32 border-black border-[1px]"
                            />
                            <Button
                                label="Details"
                                className="mx-1 rounded-sm w-32"
                                onClick={() => navigate('/tranche/details')}
                            />
                        </div>
                    ) : (
                        <div className="mx-40 mt-12">
                            <Button
                                label="Overview"
                                className="mx-1 rounded-sm w-32"
                                onClick={() => navigate('/tranche')}
                            />
                            <Button
                                label="Details"
                                primary
                                className="mx-1 rounded-sm w-32 border-black border-[1px]"
                            />
                        </div>
                    ))}
            </header>
            <main>
                <div className="max-w-[100rem] mx-auto sm:px-6 lg:px-8">
                    <div className="px-4 py-8 sm:px-0 flex flex-col gap-8">
                        {children ? (
                            children
                        ) : (
                            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96" />
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export { DashboardTemplate };
