import React from "react";
import { BsCheckLg } from "react-icons/bs";

export interface ICheckbox {
    checked: boolean;
    disabled: boolean;
    onClick?: (e: any) => void;
}

const Checkbox = ({checked, disabled, onClick}: ICheckbox) => {
    const mode = disabled ? "text-gray-100" : checked ? "" : "accent-gray-300"
    return (
        <>
            <input type="checkbox" onClick={onClick} className={["", mode].join(" ")} checked={checked} disabled={disabled}/>
            <label htmlFor="button"></label>
        </>
    )
}

export default Checkbox