import { useEffect, useState } from 'react';

export const useTimer = (seconds = 1.5) => {
    const [isTime, setIsTime] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => setIsTime(true), seconds * 1000);
        return () => clearInterval(timeout);
    }, [seconds]);

    return {
        isTime,
    };
};
