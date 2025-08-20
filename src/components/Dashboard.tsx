import React, { useRef, useState } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useDateFilter } from '@/hooks/useDateFilter';
import DashboardHeader from '@/components/DashboardHeader';
import ChartContainer from '@/components/ChartContainer';
import { 
  BREAKPOINTS, 
  GRID_COLS, 
  GRID_CONFIG, 
  DEFAULT_LAYOUTS,
  CHART_DIMENSIONS 
} from '@/config/layout';
import LineChart from '@/charts/LineChart';
import BarChart from '@/charts/BarChart';
import AreaChart from '@/charts/AreaChart';
import PieChart from '@/charts/PieChart';
import ScatterChart from '@/charts/ScatterChart';
import RadarChart from '@/charts/RadarChart';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, TrendingUp, Users, DollarSign, Activity } from 'lucide-react';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

const Dashboard: React.FC = () => {
  const { data, loading, error } = useDashboardData();
  const { dateRange, setDateRange, filterDataByDate } = useDateFilter();
  const dashboardRef = useRef<HTMLDivElement>(null);
  
  // Grid layout configuration with responsive constraints
  const [layouts, setLayouts] = useState(DEFAULT_LAYOUTS);

  const handleLayoutChange = (layout: any, layouts: any) => {
    setLayouts(layouts);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-dashboard p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="p-6">
              <Skeleton className="h-8 w-1/3 mb-4" />
              <Skeleton className="h-64 w-full" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-dashboard p-6 flex items-center justify-center">
        <Card className="p-8 max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Error Loading Dashboard</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button 
            onClick={handleRefresh}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Retry
          </button>
        </Card>
      </div>
    );
  }

  if (!data) return null;

  // Prepare data for scatter chart (performance metrics)
  const scatterData = data.performanceMetrics.map(item => ({
    loadTime: item.loadTime,
    errorRate: item.errorRate,
    uptime: item.uptime,
    date: item.date
  }));

  // Prepare data for radar chart (marketing performance)
  const radarData = data.marketingChannels.map(item => ({
    subject: item.channel,
    conversions: item.conversions,
    visitors: item.visitors / 100, // Scale down for better visualization
    roi: item.conversions / (item.cost || 1) * 100
  }));

  // Chart data configuration
  const chartData = {
    'revenue-trends': {
      title: "Revenue Trends",
      data: data.revenue,
      component: (
        <LineChart
          data={filterDataByDate(data.revenue)}
          dataKeys={['value']}
          colors={['hsl(var(--chart-primary))']}
          height={350}
        />
      )
    },
    'user-activity': {
      title: "User Activity",
      data: data.userActivity,
      component: (
        <AreaChart
          data={filterDataByDate(data.userActivity)}
          dataKeys={['activeUsers', 'newUsers', 'returningUsers']}
          colors={['hsl(var(--chart-primary))', 'hsl(var(--chart-secondary))', 'hsl(var(--chart-accent))']}
          height={350}
          stacked={true}
        />
      )
    },
    'performance-metrics': {
      title: "Performance Metrics",
      data: data.performanceMetrics,
      component: (
        <BarChart
          data={filterDataByDate(data.performanceMetrics)}
          dataKeys={['loadTime', 'errorRate']}
          colors={['hsl(var(--chart-warning))', 'hsl(var(--chart-danger))']}
          height={350}
        />
      )
    },
    'sales-category': {
      title: "Sales by Category",
      data: data.salesByCategory,
      component: (
        <PieChart
          data={data.salesByCategory}
          dataKey="value"
          nameKey="name"
          height={350}
        />
      )
    },
    'performance-correlation': {
      title: "Performance Correlation",
      data: scatterData,
      component: (
        <ScatterChart
          data={scatterData}
          xDataKey="loadTime"
          yDataKey="errorRate"
          colors={['hsl(var(--chart-info))']}
          height={350}
        />
      )
    },
    'marketing-channels': {
      title: "Marketing Channels Performance",
      data: radarData,
      component: (
        <RadarChart
          data={radarData}
          dataKeys={['conversions', 'visitors', 'roi']}
          colors={['hsl(var(--chart-primary))', 'hsl(var(--chart-secondary))', 'hsl(var(--chart-accent))']}
          height={350}
        />
      )
    },
    'regional-sales': {
      title: "Regional Sales Performance",
      data: data.regionalSales,
      component: (
        <BarChart
          data={data.regionalSales}
          dataKeys={['sales', 'growth']}
          xAxisKey="region"
          colors={['hsl(var(--chart-primary))', 'hsl(var(--chart-success))']}
          height={400}
        />
      )
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dashboard">
      <div ref={dashboardRef} className="max-w-7xl mx-auto p-6">
        <DashboardHeader
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          onRefresh={handleRefresh}
          dashboardRef={dashboardRef}
        />

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-card shadow-card border-dashboard-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Total Revenue</p>
                <p className="text-2xl font-bold text-foreground">
                  ${filterDataByDate(data.revenue).reduce((sum, item) => sum + item.value, 0).toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-chart-primary-bg rounded-lg">
                <DollarSign className="w-6 h-6 text-chart-primary" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-card shadow-card border-dashboard-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Active Users</p>
                <p className="text-2xl font-bold text-foreground">
                  {filterDataByDate(data.userActivity).reduce((sum, item) => sum + item.activeUsers, 0).toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-chart-secondary-bg rounded-lg">
                <Users className="w-6 h-6 text-chart-secondary" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-card shadow-card border-dashboard-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Avg. Load Time</p>
                <p className="text-2xl font-bold text-foreground">
                  {(filterDataByDate(data.performanceMetrics).reduce((sum, item) => sum + item.loadTime, 0) / 
                    filterDataByDate(data.performanceMetrics).length).toFixed(2)}s
                </p>
              </div>
              <div className="p-3 bg-chart-accent-bg rounded-lg">
                <Activity className="w-6 h-6 text-chart-accent" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-card shadow-card border-dashboard-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Growth Rate</p>
                <p className="text-2xl font-bold text-foreground">+24.5%</p>
              </div>
              <div className="p-3 bg-chart-success/10 rounded-lg">
                <TrendingUp className="w-6 h-6 text-chart-success" />
              </div>
            </div>
          </Card>
        </div>

        {/* React Grid Layout Charts */}
        <ResponsiveGridLayout
          className="layout"
          layouts={layouts}
          onLayoutChange={handleLayoutChange}
          breakpoints={BREAKPOINTS}
          cols={GRID_COLS}
          rowHeight={GRID_CONFIG.rowHeight}
          isDraggable={GRID_CONFIG.isDraggable}
          isResizable={GRID_CONFIG.isResizable}
          margin={GRID_CONFIG.margin}
          containerPadding={GRID_CONFIG.containerPadding}
          compactType={GRID_CONFIG.compactType}
          preventCollision={GRID_CONFIG.preventCollision}
        >
          {Object.entries(chartData).map(([chartId, chart]) => (
            <div key={chartId} className="grid-item">
              <ChartContainer
                title={chart.title}
                data={chart.data}
                className="h-full"
              >
                {chart.component}
              </ChartContainer>
            </div>
          ))}
        </ResponsiveGridLayout>
      </div>
    </div>
  );
};

export default Dashboard;