import { Transition } from '@headlessui/react';
import React from 'react';
import { IoIosWarning } from 'react-icons/io';

interface IMessageStatus {
    type?: 'success' | 'error' | 'warning';
    message: string;
    show?: boolean;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
    icon?: boolean;
}

export const MessageStatus = ({
    message,
    type,
    className,
    size = 'sm',
    show = true,
    icon,
}: IMessageStatus) => {
    const determineColor = () => {
        switch (type) {
            case 'error':
                return 'text-red-500';
            case 'warning':
                return 'text-yellow-600';
            case 'success':
                return 'text-green-500';
            default:
                return 'text-neutral-900 dark:text-neutral-300';
        }
    };

    const determineSize = () => {
        switch (size) {
            case 'lg':
                return 'text-lg';
            case 'sm':
                return 'text-sm';
            default:
                return 'text-md';
        }
    };

    return (
        <Transition
            show={show}
            enter="transition-opacity duration-100"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            className={`leading-tight flex items-center gap-1 ${determineColor()}`}
        >
            {icon && <IoIosWarning />}
            <span className={`${determineSize()} ${className}`}>{message}</span>
        </Transition>
    );
};
