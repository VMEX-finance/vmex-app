import React from 'react';

type INavItemProps = {
    label: string | React.ReactNode;
    selected?: any;
    onClick?: any;
    mobile?: boolean;
    highlighted?: boolean;
};

export const NavItem = ({ label, selected, onClick, mobile, highlighted }: INavItemProps) => {
    const mode =
        selected && !mobile
            ? 'bg-indigo-200 dark:bg-indigo-300'
            : mobile
            ? 'hover:bg-neutral-200 text-neutral-900 '
            : 'dark:text-white hover:bg-[rgb(220,220,220)] dark:hover:bg-neutral-800 dark:text-neutral-100 bg-[rgb(240,240,240)] dark:bg-[rgba(20,20,20)]';

    const highlight = highlighted
        ? '!bg-neutral-900 !text-white hover:!bg-neutral-900 dark:hover:!bg-neutral-800'
        : '';

    return (
        <button
            className={[
                'w-full px-3 2xl:px-3.5 py-1.5 rounded-[10px] transition duration-200 whitespace-nowrap',
                mode,
                highlight,
            ].join(' ')}
            onClick={onClick}
        >
            {label}
        </button>
    );
};
