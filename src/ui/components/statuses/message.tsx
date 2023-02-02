import { Transition } from '@headlessui/react';
import React from 'react';

interface IMessageStatus {
    type?: 'success' | 'error' | 'warning';
    message: string;
    show?: boolean;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

export const MessageStatus = ({ message, type, className, size, show = true }: IMessageStatus) => {
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
            enter="transition-opacity duration-75"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
        >
            <span className={`${determineColor()} ${determineSize()} ${className}`}>{message}</span>
        </Transition>
    );
};
