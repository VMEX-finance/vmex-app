import React from "react";
import Button from "../../components/Buttons/Button";
import { useNavigate } from "react-router-dom";

const LandingNavbar: React.FC = () => {
    let navigate = useNavigate();
    function launchApp(e: any) {
        e.preventDefault();
        navigate("../lending", { replace: true});
    }


    return (
        <nav className="flex flex-row sticky h-fit justify-between items-center top-0 font-basefont px-10 py-5">
            <span id="nav-logo">
                <img src="/VMEX-logo.svg" />
            </span>
            <span className="flex flex-row gap-10">
                <a href="#">Vmex Protocol</a>
                <a href="#">Governance</a>
                <a href="#">Docs</a>
                <a href="#">Security</a>
                <a href="#">FAQ</a>
            </span>
            <span>
                <Button label="launch app" onClick={launchApp} primary></Button>
            </span>
        </nav>
    )
}

export default LandingNavbar;