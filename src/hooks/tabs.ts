import React from 'react';

export const useCustomTabs = () => {
    const [tabIndex, setTabIndex] = React.useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        const tabText = (event.target as any).innerText;
        setTabIndex(newValue);
    };

    return {
        handleTabChange,
        tabIndex,
    };
};
