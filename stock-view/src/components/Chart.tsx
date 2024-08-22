import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
export interface ChartData {
  time: string;
  open: number;
  close: number;
}
const findMaxMin = (data: ChartData[]) => {
  let max = Number.MIN_VALUE;
  let min = Number.MAX_VALUE;

  data?.forEach((item) => {
    if (item.open > max) max = item.open;
    if (item.close > max) max = item.close;
    if (item.open < min) min = item.open;
    if (item.close < min) min = item.close;
  });

  return { max, min };
};
const IndexChart = ({ data }: { data: ChartData[] }) => {
  if (!data && !Boolean(data)) {
    return (
      <div className='h-screen w-full flex flex-col items-center justify-center'>
        <p className='text-2xl'>Select Index</p>
        <span className='text-sm text-gray-500'>
          index value for a given day
        </span>
      </div>
    );
  }
  const { max, min } = findMaxMin(data);
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <ResponsiveContainer width='80%' height='80%'>
        <LineChart
          className='bg-slate-800'
          // style={{ backgroundColor: '#ffffff', borderRadius: '10px' }}
          data={data}
          margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray='3 3' stroke='#e0e0e0' />
          <XAxis dataKey='time' />
          <YAxis domain={[min * 0.95, max * 1.05]} allowDataOverflow={false} />
          <Tooltip />
          <Legend />
          <Line
            type='monotone'
            dataKey='open'
            stroke='#ff0000' // Red
            dot={false}
            strokeWidth={2}
          />
          <Line
            type='monotone'
            dataKey='close'
            stroke='#0000ff' // Blue
            dot={false}
            strokeWidth={2}
          />
          <Line
            type='monotone'
            dataKey='lowest'
            stroke='#800080' // Purple
            dot={false}
            strokeWidth={2}
          />
          <Line
            type='monotone'
            dataKey='highest'
            stroke='#00ff00' // Green
            dot={false}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IndexChart;
