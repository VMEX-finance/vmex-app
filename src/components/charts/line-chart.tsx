import { lineData } from '../../utils/mock-data';
import React from 'react';
import { LineChart, Line, Tooltip, ResponsiveContainer } from 'recharts';
import { CustomTooltip } from './custom-tooltip';

type ILineChartProps = {
  data?: Array<any>;
  dataKey?: string;
  loading?: boolean;
  error?: boolean;
  color?: string;
}

const ReLineChart = (props: ILineChartProps) => {
  return (
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
  );
}

export { ReLineChart };
