import React from 'react';

type ISplitButtonProps = {
    colors?: {
        left: string;
        right: string;
    };
    content: {
        left: string | React.ReactNode;
        right: string | React.ReactNode;
    };
    onClick: {
        left: (e: React.MouseEvent<HTMLButtonElement>) => void;
        right: (e: React.MouseEvent<HTMLButtonElement>) => void;
    };
    disabled?: {
        left?: boolean;
        right?: boolean;
    };
    full?: boolean;
    className?: string;
};

export const SplitButton = ({
    colors,
    content,
    full,
    className,
    onClick,
    disabled,
}: ISplitButtonProps) => {
    return (
        <div
            className={`font-basefont ${
                full ? 'grid grid-cols-2' : 'flex items-center'
            } divide-x-2 dark:divide-brand-black ${className ? className : ''}`}
        >
            <button
                className={`${
                    colors
                        ? colors.left
                        : 'bg-brand-black text-neutral-200 dark:bg-neutral-200 dark:text-neutral-900'
                } rounded-l-md py-1 px-4 transition duration-150 hover:opacity-90`}
                onClick={onClick.left}
                disabled={disabled?.left}
            >
                {content.left}
            </button>
            <button
                className={`${
                    colors
                        ? colors.right
                        : 'bg-neutral-900 text-neutral-200 dark:bg-neutral-200 dark:text-neutral-900'
                } rounded-r-md py-1 px-4 transition duration-150 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-80`}
                onClick={onClick.right}
                disabled={disabled?.right}
            >
                {content.right}
            </button>
        </div>
    );
};
