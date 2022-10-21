import React from 'react';

interface ITabNavItemProps {
    id: string | number;
    title?: string;
    activeTab: string | number;
    setActiveTab: any;
}

export const TabNavItem = ({ id, title, activeTab, setActiveTab }: ITabNavItemProps) => {
    const handleClick = () => {
        setActiveTab(id);
    };

    return (
        <li onClick={handleClick} className={activeTab === id ? 'active' : ''}>
            {title}
        </li>
    );
};
