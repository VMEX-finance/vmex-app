import React from 'react';

type IBorder = {
    children: React.ReactNode;
    title?: string;
};

export const Border = ({ children, title }: IBorder) => {
    return (
        <div className="flex flex-col gap-1">
            {title && <h3 className="">{title}</h3>}
            <div className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 p-2">
                {children}
            </div>
        </div>
    );
};
