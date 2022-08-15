import React from "react";
import LandingNavbar from "../features/navigation/LandingNavbar"
import Footer from '../components/navigation/Footer';

interface ITemplate {
    children: React.ReactElement[] | React.ReactElement
    classes?: string 
}
const Template: React.FC<ITemplate> = ({ children, classes }) => {
    return (
        <div className={["flex flex-col", classes ].join(" ")} >
            <LandingNavbar />
            {children}
            <Footer />
        </div>
    )
}

export default Template