import React from 'react';

interface IDashboardTemplate {
    title?: string;
    hero?: React.ReactElement;
    children?: React.ReactElement | React.ReactElement[];
    description?: string | React.ReactNode;
    back?: any;
}

const DashboardTemplate: React.FC<IDashboardTemplate> = ({
    title,
    hero,
    children,
    description,
    back,
}) => {
    return (
        <div className="py-10">
            <header>
                <div className="max-w-[120rem] mx-auto flex flex-col">
                    <div className="max-w-[500px] sm:px-6 lg:px-8">
                        {back && (
                            <div className="flex flex-row gap-1">
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
            </header>
            <main>
                <div className="max-w-[120rem] mx-auto sm:px-6 lg:px-8">
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
