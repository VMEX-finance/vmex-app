import React, { useContext } from 'react';
import { Skeleton } from '@mui/material';
import { ThemeContext } from '../../../store';

type ISkeletonLoaderProps = {
    variant?: 'text' | 'rectangular' | 'rounded' | 'circular';
    height?: string | number;
    width?: string | number;
    children?: React.ReactNode;
    animtion?: false | 'pulse' | 'wave';
    className?: string;
};

export const SkeletonLoader = ({
    variant,
    height,
    width,
    children,
    animtion,
    className,
}: ISkeletonLoaderProps) => {
    const { isDark } = useContext(ThemeContext);

    return (
        <Skeleton
            variant={variant}
            height={height}
            width={width}
            animation={animtion}
            className={className}
            sx={{ bgcolor: isDark ? 'grey.900' : 'grey.300' }}
        >
            {children}
        </Skeleton>
    );
};
