import React from "react";
import { WalletButton } from "../../components/buttons/Button";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar, { MenuItem } from "../../components/navigation/Navbar";

const DashboardNavbar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    function navigateTo(e: any) {
        e.preventDefault();
        console.log(e)
        let value = e.target.innerText.toLowerCase();
        navigate(`../${value}`, { replace: false });
    };

    console.log(location)

    return (
        <nav className="flex flex-row sticky h-fit justify-between items-center top-0 font-basefont px-10 py-5">
            <span className="flex flex-row items-center gap-[70px]">
                <span id="nav-logo">
                    <img 
                        src="/VMEX-logo.svg" 
                        alt="VMEX Finance Logo"
                    />
                </span>
                <Navbar>
                    <MenuItem 
                        label="Lending" 
                        selected={location.pathname === '/lending'}
                        onClick={navigateTo}
                    />
                    <MenuItem 
                        label="Borrowing" 
                        selected={location.pathname === '/borrowing'}
                        onClick={navigateTo} 
                    />
                    <MenuItem 
                        label="Staking" 
                        selected={location.pathname === '/staking'}
                        onClick={navigateTo} 
                    />
                    <MenuItem 
                        label="Markets" 
                        selected={location.pathname === '/markets'}
                        onClick={navigateTo} 
                    />
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