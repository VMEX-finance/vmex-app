import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: 'Page A',
    amt: 200,
  },
  {
    name: 'Page B',
    amt: 600,
  },
  {
    name: 'Page C',
    amt: 1000,
  },
  {
    name: 'Page D',
    amt: 1200,
  },
  {
    name: 'Page E',
    amt: 981,
  },
  {
    name: 'Page F',
    amt: 2500,
  },
  {
    name: 'Page G',
    amt: 2100,
  },
];

const ReLineChart = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 10,
          bottom: 10,
          left: 10,
          right: 10
        }}
      >
        <Tooltip />
        <Line type="monotone" dataKey="amt" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export { ReLineChart };
