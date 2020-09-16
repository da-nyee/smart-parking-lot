import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

const textMap = {
  sales: '매출액(W)',
  usage: '이용률(%)',
};
const colorMap = {
  sales: '#8884d8',
  usage: '#82ca9d',
};

const CustomizedAxisTick = ({ x, y, stroke, payload }) => {
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor="end"
        fill="#666"
        transform="rotate(-35)"
      >
        {payload.value}
      </text>
    </g>
  );
};

const SimpleLineChart = ({ type, data }) => {
  const color = colorMap[type];
  const text = textMap[type];

  return (
    <LineChart
      width={1280}
      height={640}
      data={data}
      margin={{ top: 50, right: 30, left: 20, bottom: 10 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis
        dataKey="date"
        height={60}
        tick={<CustomizedAxisTick />}
        padding={{ left: 30, right: 30 }}
      />
      {type === 'usage' ? (
        <YAxis
          label={{ value: text, angle: -90, position: 'insideLeft' }}
          domain={[0, 100]}
        />
      ) : (
        <YAxis label={{ value: text, angle: -90, position: 'insideLeft' }} />
      )}
      <Tooltip />
      <Line type="monotone" dataKey={type} stroke={color} />
    </LineChart>
  );
};

export default SimpleLineChart;
