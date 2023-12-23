import { useEffect, useLayoutEffect, useMemo, useState } from 'react';

const breakpoints = {
    sm: 600,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
    table: 900,
};

const DEFAULT = {
    width: 1920,
    height: 1080,
};

// Hook
export function useWindowSize() {
    const [windowSize, setWindowSize] = useState(DEFAULT);

    function handleResize() {
        setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight,
        });
    }

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useLayoutEffect(() => {
        handleResize();
    }, []);

    const isBigger = (breakpoint: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'table') =>
        windowSize.width > breakpoints[breakpoint];

    return {
        ...windowSize,
        breakpoints,
        isBigger,
    };
}
