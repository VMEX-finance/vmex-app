import React from "react";
import { useWalletState } from "../../hooks/wallet/connectMetamask";

export interface IButtonProps {
    label: string | React.ReactNode;
    primary?: boolean;
    onClick?: (e: any) => void;
    border?: boolean;
    className?: string;
}

const Button = ({label, onClick, primary, border = true, className}: IButtonProps) => {
    const mode = primary ? "bg-black rounded-lg text-white hover:bg-neutral-800" : border ? "bg-white border-[2px] border-black border-solid rounded-lg hover:bg-neutral-200" : "bg-white rounded-lg hover:bg-neutral-200"
    return (
        <button onClick={onClick} className={["box-border", "font-basefont", "px-4 py-1", "transition duration-200", className, mode].join(" ")}>
            {label}
        </button>
    )
}

function truncateAddress(s: string) { return s.slice(0,3) + "..." + s.slice(-4)}
export const WalletButton = ({ primary }: IButtonProps) => {
    const {address, connectMetamask } = useWalletState()
    const mode = primary && !address ? "" : "!bg-white !text-black hover:!bg-neutral-200"
    return (
        <Button 
            primary
            onClick={connectMetamask} 
            className={["box-border", "font-basefont", "px-4 py-1", "!border-[2px] !border-black !border-solid", mode].join(" ")}
            label={address ? truncateAddress(address) : "Connect Metamask"}
        />
    )
}

export default Button;
