import React, { ReactNode } from 'react';
import { useState } from '@storybook/addons';
import { TabNavItem } from './NavItem';
import { TabContent } from './Content';

interface ITabsProps {
    tabs: string[];
    children: ReactNode[] | string[];
}
// TODO
export const Tabs = ({ tabs, children }: ITabsProps) => {
    const [activeTab, setActiveTab] = useState('tab0');

    return (
        <>
            <div>
                <ul className="nav">
                    {tabs.map((el, i: number) => (
                        <TabNavItem
                            key={`tab-nav-${i}`}
                            title={`${el}`}
                            id={`tab${i}`}
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                        />
                    ))}
                </ul>

                <div className="outlet">
                    {children.map((el, i) => (
                        <TabContent key={`tab-content-${i}`} id={`tab${i}`} activeTab={activeTab}>
                            {el}
                        </TabContent>
                    ))}
                </div>
            </div>
        </>
    );
};
