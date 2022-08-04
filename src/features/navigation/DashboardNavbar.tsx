import React from "react";
import { WalletButton } from "../../components/Buttons/Button";
import { useNavigate } from "react-router-dom";
import Navbar, { MenuItem } from "../../components/Navigation/Navbar";

const DashboardNavbar: React.FC = () => {
    let navigate = useNavigate();
    function navigateTo(e: any) {
        e.preventDefault();
        let value = e.target.value;
        navigate(`../${value}`, { replace: false });
    };

    return (
        <nav className="flex flex-row sticky h-fit justify-between items-center top-0 font-basefont px-10 py-5">
            <span className="flex flex-row items-center gap-[70px]">
                <span id="nav-logo">
                    <img src="/VMEX-logo.svg" />
                </span>
                <Navbar>
                    <MenuItem label="Lending" selected/>
                    <MenuItem label="Borrowing"/>
                    <MenuItem label="Staking" />
                    <MenuItem label="Markets" />
                    <MenuItem label="Governance" />
                    <MenuItem label="Develop" />
                </Navbar>
            </span>
            <span>
                <WalletButton label="connect wallet" primary></WalletButton>
            </span>
        </nav>
    )
}

export default DashboardNavbar;