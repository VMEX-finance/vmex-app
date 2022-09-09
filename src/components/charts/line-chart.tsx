import { lineData } from '../../utils/mock-data';
import React, { MouseEvent } from 'react';
import { LineChart, Line, Tooltip, ResponsiveContainer } from 'recharts';
import { CustomTooltip } from './custom-tooltip';

type ILineChartProps = {
  data?: Array<any>;
  dataKey?: string;
  loading?: boolean;
  error?: boolean;
  color?: string;
  timeseries?: boolean;
}

const ReLineChart = (props: ILineChartProps) => {
  const [active, setActive] = React.useState("all");

  const determineActive = (str: string) => {
    if(str === active) return '!text-white'
  }

  const handleClick = (e:any) => {
    const eventText = e.target.innerHTML;
    setActive(eventText.toLowerCase());
  }

  return (
    <>
      {props.timeseries && (
        <div className={`flex gap-3 text-neutral-500`}>
          <button className={`p-1 ${determineActive("1d")}`} onClick={handleClick}>1D</button>
          <button className={`p-1 ${determineActive("1w")}`} onClick={handleClick}>1W</button>
          <button className={`p-1 ${determineActive("1m")}`} onClick={handleClick}>1M</button>
          <button className={`p-1 ${determineActive("1y")}`} onClick={handleClick}>1Y</button>
          <button className={`p-1 ${determineActive("all")}`} onClick={handleClick}>All</button>
        </div>
      )}
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={500}
          height={300}
          data={props.data || lineData}
          margin={{
            top: 10,
            bottom: 10,
            left: 10,
            right: 10
          }}
        >
          <Tooltip content={<CustomTooltip />} />
          <Line 
            dot={{ r: 0 }}
            type="monotone" 
            dataKey={props.dataKey || 'value'} 
            stroke={props.color || "#8884d8"} 
            activeDot={{ r: 3 }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
}

export { ReLineChart };
