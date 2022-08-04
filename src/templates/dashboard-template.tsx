import React from "react";

interface IDashboardTemplate {
    title?: string;
    hero?: React.ReactElement;
    children?: React.ReactElement | React.ReactElement[]
}
const DashboardTemplate: React.FC<IDashboardTemplate> = ({ title, hero, children }) => {
    return (
        <div className="py-10">
            <header>
                <div className="max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-basefont capitalize leading-tight text-gray-900">{title}</h1>
                </div>
            </header>
            <main>
                <div className="max-w-[100rem] mx-auto sm:px-6 lg:px-8">
                    <div className="px-4 py-8 sm:px-0 flex flex-col gap-8">
                            {
                            children ? 
                            children
                            :
                            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96" />
                            }

                    </div>
                </div>
            </main>
        </div>
    )
};

export default DashboardTemplate;