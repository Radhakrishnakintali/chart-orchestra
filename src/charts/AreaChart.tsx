import React from 'react';
import { 
  AreaChart as RechartsAreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

interface AreaChartProps {
  data: any[];
  dataKeys: string[];
  colors?: string[];
  xAxisKey?: string;
  height?: number;
  stacked?: boolean;
}

const AreaChart: React.FC<AreaChartProps> = ({ 
  data, 
  dataKeys, 
  colors = ['hsl(var(--chart-primary))', 'hsl(var(--chart-secondary))', 'hsl(var(--chart-accent))'],
  xAxisKey = 'date',
  height = 300,
  stacked = false
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
      <RechartsAreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
          <Area
            key={key}
            type="monotone"
            dataKey={key}
            stackId={stacked ? "1" : undefined}
            stroke={colors[index % colors.length]}
            fill={colors[index % colors.length]}
            fillOpacity={0.6}
          />
        ))}
      </RechartsAreaChart>
    </ResponsiveContainer>
  );
};

export default AreaChart;