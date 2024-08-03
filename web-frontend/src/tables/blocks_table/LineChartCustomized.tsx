import React, { PureComponent } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Brush,
  AreaChart,
  Area,
  ResponsiveContainer,
} from 'recharts';

const data = [
  {
    name: 'Day 1',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Day 2',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Day 3',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Day 4',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Day 5',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Day 6',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Day 7',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

export default class LineChartCustomized extends PureComponent {
  static demoUrl = 'https://codesandbox.io/s/synchronized-line-charts-zc3nl';

  render() {
    return (
      <div style={{ width: '100%' }}>

        <span className='font-inria-sans text-md text-gray-400'>Average # of transactions per day</span>

        <ResponsiveContainer width="100%" height={200}>
          <LineChart
            width={500}
            height={200}
            data={data}
            syncId="anyId"
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="pv" stroke="#82ca9d" fill="#82ca9d" />
            <Brush />
          </LineChart>
        </ResponsiveContainer>

        <ResponsiveContainer width="100%" height={200}>
          <AreaChart
            width={500}
            height={200}
            data={data}
            syncId="anyId"
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="pv" stroke="#82ca9d" fill="#82ca9d" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }
}
