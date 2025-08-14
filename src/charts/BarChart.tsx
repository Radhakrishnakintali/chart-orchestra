import React from 'react';
import { 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

interface BarChartProps {
  data: any[];
  dataKeys: string[];
  colors?: string[];
  xAxisKey?: string;
  height?: number;
  layout?: 'horizontal' | 'vertical';
}

const BarChart: React.FC<BarChartProps> = ({ 
  data, 
  dataKeys, 
  colors = ['hsl(var(--chart-primary))', 'hsl(var(--chart-secondary))', 'hsl(var(--chart-accent))'],
  xAxisKey = 'date',
  height = 300,
  layout = 'vertical'
}) => {
  const formatXAxisLabel = (value: string) => {
    if (xAxisKey === 'date') {
      try {
        return new Date(value).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        });
      } catch {
        return value;
      }
    }
    return value;
  };

  const formatTooltipLabel = (value: string) => {
    if (xAxisKey === 'date') {
      try {
        return new Date(value).toLocaleDateString('en-US', { 
          year: 'numeric',
          month: 'long', 
          day: 'numeric' 
        });
      } catch {
        return value;
      }
    }
    return value;
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
          <Bar
            key={key}
            dataKey={key}
            fill={colors[index % colors.length]}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};

export default BarChart;