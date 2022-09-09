import React from "react";
import { BsCheckLg } from "react-icons/bs";

export interface ICheckboxProps {
    checked: boolean;
    disabled?: boolean;
    setChecked: any;
    label: string;
}

const Checkbox = ({checked, disabled, setChecked, label}: ICheckboxProps) => {
    const mode = disabled ? "text-gray-100" : checked ? "" : "accent-gray-300"
    return (
        <div 
            className="flex items-center gap-2"
            onClick={() => setChecked(!checked)} 
        >
            <label htmlFor="button">{label}</label>
            <input 
                type="checkbox" 
                className={["", mode].join(" ")} 
                checked={checked} 
                disabled={disabled}
            />
        </div>
    )
}

export default Checkbox