import React from 'react';
import { 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

interface PieChartProps {
  data: any[];
  dataKey: string;
  nameKey: string;
  colors?: string[];
  height?: number;
  showLabels?: boolean;
}

const PieChart: React.FC<PieChartProps> = ({ 
  data, 
  dataKey,
  nameKey,
  colors = [
    'hsl(var(--chart-primary))', 
    'hsl(var(--chart-secondary))', 
    'hsl(var(--chart-accent))',
    'hsl(var(--chart-success))',
    'hsl(var(--chart-warning))',
    'hsl(var(--chart-danger))',
    'hsl(var(--chart-info))',
    'hsl(var(--chart-purple))'
  ],
  height = 300,
  showLabels = true
}) => {
  const renderLabel = (entry: any) => {
    if (!showLabels) return '';
    const percentage = entry.percentage || 
      ((entry[dataKey] / data.reduce((sum, item) => sum + item[dataKey], 0)) * 100).toFixed(1);
    return `${percentage}%`;
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderLabel}
          outerRadius={Math.min(height * 0.35, 120)}
          fill="#8884d8"
          dataKey={dataKey}
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{
            backgroundColor: 'hsl(var(--dashboard-card))',
            border: '1px solid hsl(var(--dashboard-border))',
            borderRadius: '8px',
            boxShadow: 'var(--shadow-elevated)'
          }}
        />
        <Legend />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};

export default PieChart;