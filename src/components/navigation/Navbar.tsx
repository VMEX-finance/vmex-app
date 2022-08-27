import React from "react";

export interface NavbarInterface {
    defaultPage?: string
    children?: React.ReactElement[]
}

export interface IMenuItems {
    label: string;
    selected?: boolean;
    onClick?: (e: any) => void;
    mobile?: boolean;
}


export const MenuItem = ({label, selected, onClick, mobile}: IMenuItems) => {
    const mode = selected && !mobile ? "!bg-white !text-black" : mobile ? "hover:!bg-neutral-200" : "bg-black text-white ";

    return (
        <button 
            className={["w-full px-4 py-2 rounded-lg transition duration-200 hover:bg-neutral-700", mode].join(" ")}
            onClick={onClick}
        >
            {label}
        </button>
    )
}

const Navbar = ({children, defaultPage}: NavbarInterface) => {
    return (
        <div className={["grid grid-flow-col auto-cols-max justify-between gap-4 w-max p-[8px] shadow-lg", "bg-black rounded-2xl"].join(" ")}>
            {
                children
            }
        </div>
    )
}

export default Navbar;