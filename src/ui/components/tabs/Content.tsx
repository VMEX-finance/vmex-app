import React, { ReactNode } from 'react';

interface ITabContentProps {
    id: string | number;
    activeTab: string | number;
    children: ReactNode;
}

export const TabContent = ({ id, activeTab, children }: ITabContentProps) => {
    return activeTab === id ? <div className="TabContent">{children}</div> : null;
};
