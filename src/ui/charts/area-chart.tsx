import React from 'react';
import {
    LineChart,
    Line,
    Tooltip,
    ResponsiveContainer,
    XAxis,
    YAxis,
    AreaChart,
    Area,
} from 'recharts';
import { CustomTooltip } from './tooltip';
import { addMissingDatesToTimeseries, getTimeseriesAvgByDay } from '@/utils';
import { ILineChartDataPointProps } from './line-chart';

type IAreaChartProps = {
    data: Array<ILineChartDataPointProps>;
    dataKey?: string;
    dataKey2?: string;
    dataKey3?: string;
    loading?: boolean;
    error?: boolean;
    color2?: string;
    color3?: string;
    timeseries?: boolean;
    xaxis?: boolean;
    yaxis?: boolean;
    labels?: boolean;
    type?: 'asset-stats' | 'utilization' | 'usd' | 'default';
    noTooltip?: boolean;
    height?: `h-${string}`;
    interval?: 'datapoint' | 'day';
};

export const ReAreaChart = (props: IAreaChartProps) => {
    const [datedData, setDatedData] = React.useState(props.data);
    const [active, setActive] = React.useState('all');

    const determineActive = (str: string) => {
        if (str === active) return '!text-white';
    };

    const handleClick = (e: any) => {
        const eventText = e.target.innerHTML?.toLowerCase();
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
                {props.data?.length > 1 && !props.error ? (
                    <AreaChart
                        width={500}
                        height={300}
                        data={
                            props.interval === 'datapoint'
                                ? datedData
                                : addMissingDatesToTimeseries(
                                      getTimeseriesAvgByDay(datedData as any),
                                  )
                        }
                        margin={{
                            top: 10,
                            bottom: 10,
                            left: 10,
                            right: props.yaxis ? 50 : 10,
                        }}
                    >
                        {!props.noTooltip && (
                            <Tooltip content={<CustomTooltip type={props.type} />} />
                        )}

                        <defs>
                            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.5} />
                                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.6} />
                                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                            </linearGradient>
                        </defs>

                        <Area
                            type="monotone"
                            dataKey={props.dataKey || 'value'}
                            stroke="#8884d8"
                            fillOpacity={1}
                            strokeWidth={2}
                            fill="url(#colorUv)"
                        />

                        {props.data.length > 0 &&
                            (props.data[0].value2 || props.data[0].value2 === 0) && (
                                <Line
                                    dot={{ r: 0 }}
                                    type="monotone"
                                    dataKey={props.dataKey2 || 'value2'}
                                    stroke={props.color2 || '#fff'}
                                    activeDot={{ r: 3 }}
                                    connectNulls={true}
                                />
                            )}
                        {props.data.length > 0 &&
                            (props.data[0].value3 || props.data[0].value3 === 0) && (
                                <Line
                                    dot={{ r: 0 }}
                                    type="monotone"
                                    dataKey={props.dataKey3 || 'value3'}
                                    stroke={props.color3 || '#7667db'}
                                    activeDot={{ r: 3 }}
                                    connectNulls={true}
                                />
                            )}
                        {props.xaxis && <XAxis dataKey="xaxis" tickLine={false} />}
                        {props.yaxis && (
                            <YAxis
                                tickLine={false}
                                ticks={props.type === 'utilization' ? [0, 100] : []}
                            />
                        )}
                    </AreaChart>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p>No Data Available</p>
                    </div>
                )}
            </ResponsiveContainer>
        </>
    );
};
