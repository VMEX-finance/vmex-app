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
            ? 'bg-neutral-100 text-neutral-900'
            : mobile
            ? 'hover:bg-neutral-200 text-neutral-900'
            : 'bg-black dark:bg-neutral-900 text-white hover:bg-neutral-800 dark:hover:bg-neutral-800';

    const highlight = highlighted
        ? '!bg-neutral-900 !text-white hover:!bg-neutral-800 dark:hover:!bg-neutral-800'
        : '';

    return (
        <button
            className={[
                'w-full px-3 xl:px-4 py-2 rounded-lg transition duration-200 whitespace-nowrap',
                mode,
                highlight,
            ].join(' ')}
            onClick={onClick}
        >
            {label}
        </button>
    );
};
