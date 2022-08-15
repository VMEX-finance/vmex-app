import React from "react";

export interface NavbarInterface {
    defaultPage?: string
    children?: React.ReactElement[]
}

export interface IMenuItems {
    label: string;
    selected?: boolean;
    onClick?: (e: any) => void;
}


export const MenuItem = ({label, selected, onClick}: IMenuItems) => {
    const mode = selected ? "!bg-white !text-black" : "bg-black text-white" 
    return (
        <button 
            className={["w-full p-[8px] rounded-lg hover:bg-neutral-600 transition duration-200", mode].join(" ")}
            onClick={onClick}
        >
            {label}
        </button>
    )
}

const Navbar = ({children, defaultPage}: NavbarInterface) => {
    return (
        <div className={["grid grid-flow-col auto-cols-max justify-between gap-8 w-max p-[8px]", "bg-black rounded-[18px]"].join(" ")}>
            {
                children
            }
        </div>
    )
}

export default Navbar;