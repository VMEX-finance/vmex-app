import React from "react";

export interface NavbarInterface {
    defaultPage?: string
    pages?: string[]
}

const Navbar = ({defaultPage, pages}: NavbarInterface) => {
    return (
        <div className={["grid grid-flow-col auto-cols-max justify-between px-3 py-2 gap-8 w-min", "font-basefont text-white text-[12px]", "bg-black rounded-lg"].join(" ")}>
            {
                pages?.map((i) => <p className="px-2 py-2">{i}</p>)
            }
        </div>
    )
}

export default Navbar;