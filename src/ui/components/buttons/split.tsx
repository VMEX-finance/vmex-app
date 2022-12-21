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
    full?: boolean;
    className?: string;
};

export const SplitButton = ({ colors, content, full, className, onClick }: ISplitButtonProps) => {
    return (
        <div
            className={`${
                full ? 'grid grid-cols-2' : 'flex items-center'
            } divide-x dark:divide-black ${className ? className : ''}`}
        >
            <button
                className={`${
                    colors ? colors.left : 'bg-neutral-800 text-neutral-100'
                } rounded-l-md py-1 px-3 transition duration-150 hover:opacity-90`}
                onClick={onClick.left}
            >
                {content.left}
            </button>
            <button
                className={`${
                    colors ? colors.right : 'bg-neutral-800 text-neutral-100'
                } rounded-r-md py-1 px-3 transition duration-150 hover:opacity-90`}
                onClick={onClick.right}
            >
                {content.right}
            </button>
        </div>
    );
};
