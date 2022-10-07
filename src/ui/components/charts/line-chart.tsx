import React, { MouseEvent } from 'react';
import { LineChart, Line, Tooltip, ResponsiveContainer } from 'recharts';
import { CustomTooltip } from './custom-tooltip';

export type IDataProps = {
    date: string;
    value: number;
};

type ILineChartProps = {
    data: Array<IDataProps>;
    dataKey?: string;
    loading?: boolean;
    error?: boolean;
    color?: string;
    timeseries?: boolean;
};

export const ReLineChart = (props: ILineChartProps) => {
    const [datedData, setDatedData] = React.useState(props.data);
    const [active, setActive] = React.useState('all');

    const determineActive = (str: string) => {
        if (str === active) return '!text-white';
    };

    const handleClick = (e: any) => {
        const eventText = e.target.innerHTML.toLowerCase();
        setActive(eventText);

        const toDate = new Date();
        let fromDate: Date;
        switch (eventText) {
            case '1d':
                fromDate = new Date(toDate.setDate(toDate.getDate() - 1));
                break;
            case '1w':
                fromDate = new Date(toDate.setDate(toDate.getDate() - 7));
                break;
            case '1m':
                fromDate = new Date(toDate.setDate(toDate.getDate() - 30));
                break;
            case '1y':
                fromDate = new Date(toDate.setDate(toDate.getDate() - 365));
                break;
            default:
                setDatedData(props.data);
                return;
        }

        const rangeData = props.data.filter((el: any) => {
            return (
                new Date(el.date).getTime() >= fromDate.getTime() &&
                new Date(el.date).getTime() <= new Date().getTime()
            );
        });

        setDatedData(rangeData);
    };

    return (
        <>
            {props.timeseries && (
                <div className={`flex gap-2 text-neutral-500 text-sm`}>
                    <button className={`p-1 ${determineActive('1d')}`} onClick={handleClick}>
                        1D
                    </button>
                    <button className={`p-1 ${determineActive('1w')}`} onClick={handleClick}>
                        1W
                    </button>
                    <button className={`p-1 ${determineActive('1m')}`} onClick={handleClick}>
                        1M
                    </button>
                    <button className={`p-1 ${determineActive('1y')}`} onClick={handleClick}>
                        1Y
                    </button>
                    <button className={`p-1 ${determineActive('all')}`} onClick={handleClick}>
                        All
                    </button>
                </div>
            )}
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    width={500}
                    height={300}
                    data={datedData}
                    margin={{
                        top: 10,
                        bottom: 10,
                        left: 10,
                        right: 10,
                    }}
                >
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                        dot={{ r: 0 }}
                        type="monotone"
                        dataKey={props.dataKey || 'value'}
                        stroke={props.color || '#8884d8'}
                        activeDot={{ r: 3 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </>
    );
};
