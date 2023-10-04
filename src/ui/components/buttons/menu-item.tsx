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
            ? 'bg-neutral-100 text-neutral-900 !shadow-inner !shadow-neutral-500'
            : mobile
            ? 'hover:bg-neutral-200 text-neutral-900'
            : 'bg-brand-black dark:bg-neutral-900 text-white hover:bg-neutral-800 dark:hover:bg-neutral-800';

    const highlight = highlighted
        ? '!bg-neutral-900 !text-white hover:!bg-neutral-800 dark:hover:!bg-neutral-800'
        : '';

    return (
        <button
            className={[
                'w-full px-3 2xl:px-3.5 py-1.5 rounded-lg transition duration-200 whitespace-nowrap',
                mode,
                highlight,
            ].join(' ')}
            onClick={onClick}
        >
            {label}
        </button>
    );
};
