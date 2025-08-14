import React from 'react';
import { 
  ScatterChart as RechartsScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

interface ScatterChartProps {
  data: any[];
  xDataKey: string;
  yDataKey: string;
  zDataKey?: string;
  colors?: string[];
  height?: number;
}

const ScatterChart: React.FC<ScatterChartProps> = ({ 
  data, 
  xDataKey,
  yDataKey,
  zDataKey,
  colors = ['hsl(var(--chart-primary))'],
  height = 300
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--dashboard-border))" />
        <XAxis 
          dataKey={xDataKey} 
          type="number"
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
        />
        <YAxis 
          dataKey={yDataKey}
          type="number"
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
        />
        <Tooltip 
          cursor={{ strokeDasharray: '3 3' }}
          contentStyle={{
            backgroundColor: 'hsl(var(--dashboard-card))',
            border: '1px solid hsl(var(--dashboard-border))',
            borderRadius: '8px',
            boxShadow: 'var(--shadow-elevated)'
          }}
        />
        <Legend />
        <Scatter 
          name="Data Points" 
          data={data} 
          fill={colors[0]}
        />
      </RechartsScatterChart>
    </ResponsiveContainer>
  );
};

export default ScatterChart;