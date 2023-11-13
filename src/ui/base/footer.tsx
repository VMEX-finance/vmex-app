import React from 'react';

export const Footer: React.FC = () => {
    return (
        <div className="text-brand-black bg-white w-full font-basefont flex justify-between items-center max-w-[125rem] mx-auto p-2 md:px-4 2xl:px-6 text-sm shadow-[0px_0px_10px_0px_rgba(0,0,0,0.75)] shadow-gray-300 dark:shadow-neutral-950 mt-4">
            <span className="text-xs" id="foot-caption">
                Volatile Labs, LLC &copy; {new Date().getFullYear()}
            </span>
            <span></span>
        </div>
    );
};
