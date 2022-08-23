import React from "react";
import { useWalletState } from "../../hooks/wallet/connectMetamask";

export interface IButtonProps {
    label: string | React.ReactNode;
    primary?: boolean;
    onClick?: (e: any) => void;
    border?: boolean | string;
    className?: string;
    disabled?: boolean;
}

const Button = ({label, onClick, primary, border = true, className, disabled}: IButtonProps) => {
    const mode = primary ? "bg-black !rounded-lg text-white hover:bg-neutral-800" : border ? `bg-white text-neutral-900 border-[2px] border-black border-solid rounded-lg hover:bg-neutral-200` : "bg-white text-neutral-900 rounded-lg hover:bg-neutral-200"
    return (
        <button 
            disabled={disabled} 
            onClick={onClick} 
            className={["box-border", "font-basefont", "px-4 py-1", "transition duration-200", className, mode, `${disabled ? 'hover:!bg-inherit !cursor-not-allowed' : ''}`].join(" ")}
        >
            {label}
        </button>
    )
}

function truncateAddress(s: string) { return s.slice(0,3) + "..." + s.slice(-4)}
export const WalletButton = ({ primary, className, label }: IButtonProps) => {
    const _label = label;

    const {address, connectMetamask } = useWalletState()
    const mode = primary && !address ? "" : "!bg-white !text-black hover:!bg-neutral-200"
    return (
        <Button 
            primary
            onClick={connectMetamask} 
            className={["box-border", "whitespace-nowrap", "font-basefont", "px-4 py-1", "!border-[2px] !border-black !border-solid", mode, className].join(" ")}
            label={address ? truncateAddress(address) : (_label || "Connect Metamask")}
        />
    )
}

export default Button;
