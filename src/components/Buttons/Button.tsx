import React from "react";

interface ButtonProps {
    children: string;
    primary: boolean;
    onClick?: (e: any) => void;
}

const Button = ({children, onClick, primary}: ButtonProps) => {
    const mode = primary ? "bg-black rounded-lg text-white" : "bg-white border-[2px] border-black border-solid rounded-lg"
    return (
        <button onClick={onClick} className={["box-border", "font-basefont", "px-4 py-1", mode].join(" ")}>
            {children}
        </button>
    )
}

export default Button
