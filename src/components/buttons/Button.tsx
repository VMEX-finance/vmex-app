import React from "react";
import { useWalletState } from "../../hooks/wallet/connectMetamask";

export interface IButtonProps {
    label: string;
    primary?: boolean;
    onClick?: (e: any) => void;
}

const Button = ({label, onClick, primary}: IButtonProps) => {
    const mode = primary ? "bg-black rounded-lg text-white" : "bg-white border-[2px] border-black border-solid rounded-lg"
    return (
        <button onClick={onClick} className={["box-border", "font-basefont", "px-4 py-1", mode].join(" ")}>
            {label}
        </button>
    )
}

function truncateAddress(s: string) { return s.slice(0,3) + "..." + s.slice(-4)}
export const WalletButton = ({ label, onClick, primary }: IButtonProps) => {
    const {address, connectMetamask } = useWalletState()
    const mode = primary && !address ? "bg-black rounded-lg text-white" : "bg-white border-[2px] border-black border-solid rounded-lg"
    return (
        <button onClick={connectMetamask} className={["box-border", "font-basefont", "px-4 py-1", mode].join(" ")}>
            {address ? truncateAddress(address) : "Connect Metamask"}
        </button>
    )
}

export default Button;
