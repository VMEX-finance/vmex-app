import React, { ReactElement } from 'react';
import { Footer, Navbar } from '@/ui/base';
import { DashboardTemplate } from '../templates/dashboard-template';
import { AllModalsInstance } from '../modals';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export interface IAppTemplateProps {
    children?: React.ReactElement | React.ReactElement[];
    title?: string | ReactElement;
    description?: string | React.ReactNode;
    view?: string;
    setView?: any;
    titleLoading?: boolean;
    right?: React.ReactNode;
    descriptionLoading?: boolean;
    topRight?: React.ReactNode;
}

const Base: React.FC<IAppTemplateProps> = ({
    children,
    title,
    description,
    view,
    setView,
    titleLoading,
    right,
    descriptionLoading,
    topRight,
}) => {
    return (
        <div className="min-h-screen bg-[#eaeaea] dark:bg-brand-background">
            <Navbar />
            <DashboardTemplate
                title={title}
                description={description}
                view={view}
                setView={setView}
                titleLoading={titleLoading}
                descriptionLoading={descriptionLoading}
                right={right}
                topRight={topRight}
            >
                {children}
            </DashboardTemplate>
            {/* <Footer /> */}

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
export { Base };
