import React from "react";


export interface IDropdown {
    label: string;
    menuItems?: React.ReactElement[];
    primary?: boolean;
    onClick?: (e: any) => void;
}

interface IDropdownItem {
    label: string;
    selected?: boolean;
    onClick?: (e: any) => void;
}
export const DropdownItem = ({label, selected, onClick}: IDropdownItem ) => {
    return (
        <></>
        // <Dropdown.Item>
        //     {label}
        // </Dropdown.Item> 
    )
}

const DropdownButton = ({label, menuItems, primary, onClick}: IDropdown) => {
    const mode = primary ? "text-white bg-black" : "bg-white border-2 border-black border-solid text-black"
    return (
        <></>
        // <Dropdown label={label} color="red">
        //     {menuItems?.map(i => <Dropdown.Item>{i}</Dropdown.Item>) }
        // </Dropdown>
    )
}

export default DropdownButton;