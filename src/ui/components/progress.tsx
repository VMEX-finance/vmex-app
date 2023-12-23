import { LinearProgress } from '@mui/material';
import React from 'react';

type IProgressBar = {
    progress?: number;
    setProgress?: React.Dispatch<React.SetStateAction<number>>;
};

export const ProgressBar = ({ progress, setProgress }: IProgressBar) => {
    const [_progress, _setProgress] = React.useState(10);
    const realProgress = progress ?? _progress;
    const realSetProgress = setProgress ?? _setProgress;

    const progressRef = React.useRef(() => {});
    React.useEffect(() => {
        progressRef.current = () => {
            if (realProgress > 100) {
                realSetProgress(100);
            } else {
                const diff = Math.random() * 20;
                realSetProgress(realProgress + diff);
            }
        };
    });

    React.useEffect(() => {
        const timer = setInterval(() => {
            if (realProgress < 100) progressRef.current();
        }, 100);

        return () => {
            clearInterval(timer);
        };
    }, []);
    return <LinearProgress variant="determinate" value={realProgress} />;
};
