import { ToastNotification } from '../features';
import React from 'react';
import { Navbar } from '../../ui/base';
import { DashboardTemplate } from './dashboard-template';
import { AllModalsInstance } from '../modals';

interface IAppTemplateProps {
    children?: React.ReactElement | React.ReactElement[];
    title?: string;
    description?: string | React.ReactNode;
    view?: string;
    setView?: any;
}

const AppTemplate: React.FC<IAppTemplateProps> = ({
    children,
    title,
    description,
    view,
    setView,
}) => {
    return (
        <div className="h-screen">
            <Navbar />
            <DashboardTemplate
                title={title}
                description={description}
                view={view}
                setView={setView}
            >
                {children}
            </DashboardTemplate>

            <AllModalsInstance />
            <ToastNotification />
        </div>
    );
};
export { AppTemplate };
