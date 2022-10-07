import React from 'react';
import { DashboardNavbar } from '../../ui/base';
import { DashboardTemplate } from './dashboard-template';
import { ModalTemplate } from './modal-template';

interface IAppTemplate {
    children?: React.ReactElement | React.ReactElement[];
    title?: string;
    description?: string | React.ReactNode;
    back?: any;
}

const AppTemplate: React.FC<IAppTemplate> = ({ children, title, description, back }) => {
    return (
        <div className="h-screen">
            <DashboardNavbar />
            <ModalTemplate />
            <DashboardTemplate title={title} description={description} back={back}>
                {children}
            </DashboardTemplate>
        </div>
    );
};
export { AppTemplate };
