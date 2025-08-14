import React from 'react';
import { 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

interface LineChartProps {
  data: any[];
  dataKeys: string[];
  colors?: string[];
  xAxisKey?: string;
  height?: number;
}

const LineChart: React.FC<LineChartProps> = ({ 
  data, 
  dataKeys, 
  colors = ['hsl(var(--chart-primary))', 'hsl(var(--chart-secondary))', 'hsl(var(--chart-accent))'],
  xAxisKey = 'date',
  height = 300
}) => {
  const formatXAxisLabel = (value: string) => {
    try {
      return new Date(value).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    } catch {
      return value;
    }
  };

  const formatTooltipLabel = (value: string) => {
    try {
      return new Date(value).toLocaleDateString('en-US', { 
        year: 'numeric',
        month: 'long', 
        day: 'numeric' 
      });
    } catch {
      return value;
    }
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--dashboard-border))" />
        <XAxis 
          dataKey={xAxisKey} 
          tickFormatter={formatXAxisLabel}
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
        />
        <YAxis 
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
        />
        <Tooltip 
          labelFormatter={formatTooltipLabel}
          contentStyle={{
            backgroundColor: 'hsl(var(--dashboard-card))',
            border: '1px solid hsl(var(--dashboard-border))',
            borderRadius: '8px',
            boxShadow: 'var(--shadow-elevated)'
          }}
        />
        <Legend />
        {dataKeys.map((key, index) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={colors[index % colors.length]}
            strokeWidth={2}
            dot={{ fill: colors[index % colors.length], strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: colors[index % colors.length], strokeWidth: 2 }}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

export default LineChart;