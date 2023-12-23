import { ITransition } from '@/types/transitions';
import { Transition } from '@headlessui/react';
import React from 'react';

export const Fade = ({
    children,
    className,
    duration,
    type,
    show,
}: ITransition & { type?: 'in' | 'out' }) => {
    const renderProps = () => {
        if (type === 'out')
            return {
                show,
                className: className ?? '',
                enter: `transition-opacity ${duration ?? '150'}`,
                enterFrom: 'opacity-100',
                enterTo: 'opacity-0 ',
                leave: `transition-opacity ${duration ?? '150'}`,
                leaveFrom: 'opacity-0',
                leaveTo: 'opacity-100',
            };
        return {
            show,
            className: className ?? '',
            enter: `transition-opacity ${duration ?? '150'}`,
            enterFrom: 'opacity-0',
            enterTo: 'opacity-100 ',
            leave: `transition-opacity ${duration ?? '150'}`,
            leaveFrom: 'opacity-100',
            leaveTo: 'opacity-0',
        };
    };
    return <Transition {...renderProps()}>{children}</Transition>;
};
