import React from 'react';
import { 
  RadarChart as RechartsRadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';

interface RadarChartProps {
  data: any[];
  dataKeys: string[];
  colors?: string[];
  height?: number;
}

const RadarChart: React.FC<RadarChartProps> = ({ 
  data, 
  dataKeys,
  colors = ['hsl(var(--chart-primary))', 'hsl(var(--chart-secondary))', 'hsl(var(--chart-accent))'],
  height = 300
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsRadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <PolarGrid stroke="hsl(var(--dashboard-border))" />
        <PolarAngleAxis 
          dataKey="subject" 
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
        />
        <PolarRadiusAxis 
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
          tickCount={4}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'hsl(var(--dashboard-card))',
            border: '1px solid hsl(var(--dashboard-border))',
            borderRadius: '8px',
            boxShadow: 'var(--shadow-elevated)'
          }}
        />
        <Legend />
        {dataKeys.map((key, index) => (
          <Radar
            key={key}
            name={key}
            dataKey={key}
            stroke={colors[index % colors.length]}
            fill={colors[index % colors.length]}
            fillOpacity={0.3}
            strokeWidth={2}
          />
        ))}
      </RechartsRadarChart>
    </ResponsiveContainer>
  );
};

export default RadarChart;