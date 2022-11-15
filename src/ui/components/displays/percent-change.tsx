import React from 'react';
import { MdTrendingUp, MdTrendingDown } from 'react-icons/md';

interface IPercentChangeDisplay {
    value?: number | string;
    range?: 'YTD' | 'M' | 'D';
    fontSize?: string;
}

export const PercentChangeDisplay = ({
    value = 0,
    range = 'YTD',
    fontSize = '',
}: IPercentChangeDisplay) => {
    const determineIcon = () => {
        const size = '24px';
        if (Number(value) > 0) return <MdTrendingUp size={size} />;
        else if (Number(value) < 0) return <MdTrendingDown size={size} />;
        else return <></>;
    };

    const determineColor = () => {
        if (Number(value) > 0) return 'text-green-500';
        else if (Number(value) < 0) return 'text-red-500';
        else return '';
    };

    return (
        <div className={`flex items-center gap-2 ${fontSize} ${determineColor()}`}>
            {determineIcon()}
            <p>{`${Math.abs(Number(value)).toFixed(2)}%`}</p>
            <p>{`(${range})`}</p>
        </div>
    );
};
