import React from 'react';
import { Navbar } from '../../ui/base';
import { DashboardTemplate } from './dashboard-template';
import { ModalTemplate } from './modal-template';

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
            <ModalTemplate />
            <DashboardTemplate
                title={title}
                description={description}
                view={view}
                setView={setView}
            >
                {children}
            </DashboardTemplate>
        </div>
    );
};
export { AppTemplate };
