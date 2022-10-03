import React from 'react';
import { DashboardNavbar } from '../../ui/base';
import { DashboardTemplate } from './dashboard-template';
import { ModalTemplate } from './modal-template';

interface IAppTemplate {
    children?: React.ReactElement | React.ReactElement[];
    title?: string;
    description?: string | React.ReactNode;
}

const AppTemplate: React.FC<IAppTemplate> = ({ children, title, description }) => {
    return (
        <div className="h-screen">
            <DashboardNavbar />
            <ModalTemplate />
            <DashboardTemplate title={title} description={description}>
                {children}
            </DashboardTemplate>
        </div>
    );
};
export { AppTemplate };
