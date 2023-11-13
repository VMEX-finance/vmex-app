import React from 'react';

type IMenuItemButtonProps = {
    label: string | React.ReactNode;
    selected?: any;
    onClick?: any;
    mobile?: boolean;
    highlighted?: boolean;
};

export const MenuItemButton = ({
    label,
    selected,
    onClick,
    mobile,
    highlighted,
}: IMenuItemButtonProps) => {
    const mode =
        selected && !mobile
            ? 'bg-brand-black text-white'
            : mobile
            ? 'hover:bg-neutral-200 text-neutral-900 '
            : 'dark:text-white hover:bg-[rgb(210,210,210)] dark:hover:bg-neutral-700 dark:text-neutral-100 bg-[rgb(230,230,230)] dark:bg-[rgba(32,32,32)]';

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
