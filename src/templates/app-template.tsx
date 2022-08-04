import React from "react";
import DashboardNavbar from "../features/navigation/DashboardNavbar";
import DashboardTemplate from "./dashboard-template";
import ModalTemplate from "./modal-template";

interface IAppTemplate {
    children?: React.ReactElement | React.ReactElement[];
    title?: string;
}

const AppTemplate: React.FC<IAppTemplate> = ({ children, title }) => {
    return (
        <div className="h-screen bg-[#EEEEEE]">
            <DashboardNavbar />
            <ModalTemplate />
            <DashboardTemplate title={title}>
                {children}
            </DashboardTemplate>
        </div>
    )
}
export default AppTemplate