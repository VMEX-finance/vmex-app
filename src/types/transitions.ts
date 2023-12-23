import { ReactNode } from 'react';

export type IDuration = '150' | '300' | '500' | '700' | '1000';

export type ITransition = {
    className?: string;
    children: ReactNode;
    duration?: IDuration;
    show?: boolean;
};
