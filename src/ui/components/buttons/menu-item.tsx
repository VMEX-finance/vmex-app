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
            ? 'bg-white text-black'
            : mobile
            ? 'hover:!bg-neutral-200 text-neutral-900'
            : 'bg-black text-white ';

    const highlight = highlighted ? '!bg-neutral-900 !text-white hover:!bg-neutral-800' : '';

    return (
        <button
            className={[
                'w-full px-3 xl:px-4 py-2 rounded-lg transition duration-200 hover:bg-neutral-700 whitespace-nowrap',
                mode,
                highlight,
            ].join(' ')}
            onClick={onClick}
        >
            {label}
        </button>
    );
};
