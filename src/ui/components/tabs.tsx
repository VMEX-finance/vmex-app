import React from 'react';
import { Tab, Tabs } from '@mui/material';

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export const CustomTabs = ({
    tabs,
    tabIndex,
    handleTabChange,
    id,
}: {
    tabs: string[];
    tabIndex: number;
    id: string;
    handleTabChange: (event: React.SyntheticEvent, newValue: number) => void;
}) => {
    return (
        <div className="border-b border-gray-300 dark:border-gray-700">
            <Tabs
                value={tabIndex}
                onChange={handleTabChange}
                aria-label="staking tabs"
                textColor="primary"
                indicatorColor="primary"
            >
                {tabs.map((tab, i) => (
                    <Tab
                        label={<span className="normal-case">{tab}</span>}
                        key={`simple-tab-${id}-${i}`}
                        disableFocusRipple
                        disableTouchRipple
                        {...a11yProps(i)}
                    />
                ))}
            </Tabs>
        </div>
    );
};

export function CustomTabPanel(props: {
    children?: React.ReactNode;
    index: number;
    value: number;
}) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            {...other}
        >
            {value === index && <div className="pt-2 xl:pt-3">{children}</div>}
        </div>
    );
}
