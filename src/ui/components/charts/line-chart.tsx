import React from 'react';
import { LineChart, Line, Tooltip, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { CustomTooltip } from './custom-tooltip';

export type ILineChartDataPointProps = {
    xaxis: string | number; // x axis
    value: number; // y axis
    value2?: number; // y axis
    value3?: number; // y axis
    asset?: string;
};

type ILineChartProps = {
    data: Array<ILineChartDataPointProps>;
    dataKey?: string;
    dataKey2?: string;
    dataKey3?: string;
    loading?: boolean;
    error?: boolean;
    color?: string;
    color2?: string;
    color3?: string;
    timeseries?: boolean;
    xaxis?: boolean;
    yaxis?: boolean;
    labels?: boolean;
    type?: 'asset-stats' | 'utilization' | 'default';
    noTooltip?: boolean;
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
                new Date(el.xaxis).getTime() >= fromDate.getTime() &&
                new Date(el.xaxis).getTime() <= new Date().getTime()
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
                        right: props.yaxis ? 50 : 10,
                    }}
                >
                    {!props.noTooltip && <Tooltip content={<CustomTooltip type={props.type} />} />}
                    <Line
                        dot={{ r: 0 }}
                        type="monotone"
                        dataKey={props.dataKey || 'value'}
                        stroke={props.color || '#8884d8'}
                        activeDot={{ r: 3 }}
                    />
                    {props.data.length > 0 && props.data[0].value2 && (
                        <Line
                            dot={{ r: 0 }}
                            type="monotone"
                            dataKey={props.dataKey2 || 'value2'}
                            stroke={props.color2 || '#fff'}
                            activeDot={{ r: 3 }}
                        />
                    )}
                    {props.data.length > 0 && props.data[0].value3 && (
                        <Line
                            dot={{ r: 0 }}
                            type="monotone"
                            dataKey={props.dataKey3 || 'value3'}
                            stroke={props.color3 || '#7667db'}
                            activeDot={{ r: 3 }}
                        />
                    )}
                    {props.xaxis && <XAxis dataKey="xaxis" tickLine={false} />}
                    {props.yaxis && <YAxis tickLine={false} domain={[2, 'auto']} />}
                </LineChart>
            </ResponsiveContainer>
        </>
    );
};
