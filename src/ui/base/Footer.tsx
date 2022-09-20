import React from "react";

export const Footer: React.FC = () => { 
    return (
        <div className="bg-black text-white w-full absolute bottom-0 font-basefont flex flex-row justify-between items-center py-5 px-10">
            <span id="foot-caption">
                Copyright VMEX Financial LLC
            </span>
            <span></span>
        </div>
    )
}