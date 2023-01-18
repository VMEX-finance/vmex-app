import React from 'react';
import { Navbar } from '../../ui/base';
import { DashboardTemplate } from './dashboard-template';
import { AllModalsInstance } from '../modals';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface IAppTemplateProps {
    children?: React.ReactElement | React.ReactElement[];
    title?: string;
    description?: string | React.ReactNode;
    view?: string;
    setView?: any;
    titleLoading?: boolean;
    right?: React.ReactNode;
}

const AppTemplate: React.FC<IAppTemplateProps> = ({
    children,
    title,
    description,
    view,
    setView,
    titleLoading,
    right,
}) => {
    return (
        <div className="min-h-screen bg-[#eee] dark:bg-neutral-900">
            <Navbar />
            <DashboardTemplate
                title={title}
                description={description}
                view={view}
                setView={setView}
                titleLoading={titleLoading}
                right={right}
            >
                {children}
            </DashboardTemplate>

            <AllModalsInstance />
            <ToastContainer
                position="bottom-right"
                autoClose={6000}
                hideProgressBar={false}
                newestOnTop={false}
                rtl={false}
                draggable
                pauseOnHover
                theme="light"
            />
        </div>
    );
};
export { AppTemplate };
