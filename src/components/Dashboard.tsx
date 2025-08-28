import React, { useRef, useState } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useDateFilter } from '@/hooks/useDateFilter';
import DashboardHeader from '@/components/DashboardHeader';
import ChartContainer from '@/components/ChartContainer';
import DrillDownModal from '@/components/DrillDownModal';
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
import { AlertCircle, TrendingUp, ShieldCheck, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

const Dashboard: React.FC = () => {
  const { data, loading, error } = useDashboardData();
  const { dateRange, setDateRange, filterDataByDate } = useDateFilter();
  const dashboardRef = useRef<HTMLDivElement>(null);
  
  // Grid layout configuration with responsive constraints
  const [layouts, setLayouts] = useState(DEFAULT_LAYOUTS);
  
  // Drill-down modal state
  const [drillDownModal, setDrillDownModal] = useState<{
    isOpen: boolean;
    title: string;
    type: 'deviation' | 'capa' | 'compliance' | 'audit';
    data: any;
    selectedItem?: any;
  }>({
    isOpen: false,
    title: '',
    type: 'deviation',
    data: null,
    selectedItem: null
  });

  const handleLayoutChange = (layout: any, layouts: any) => {
    setLayouts(layouts);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleChartClick = (chartType: 'deviation' | 'capa' | 'compliance' | 'audit', clickData: any) => {
    let modalData;
    let title;
    let selectedItem;

    switch (chartType) {
      case 'deviation':
        modalData = data?.deviations || [];
        title = `Deviation Details - ${clickData?.payload?.name || clickData?.payload?.category || 'Category'}`;
        selectedItem = clickData?.payload;
        break;
      case 'capa':
        modalData = data?.capa || [];
        title = `CAPA Analysis - ${new Date(clickData?.payload?.date || Date.now()).toLocaleDateString()}`;
        selectedItem = clickData?.payload;
        break;
      case 'compliance':
        modalData = data?.compliance || [];
        title = `Compliance Metrics - ${new Date(clickData?.payload?.date || Date.now()).toLocaleDateString()}`;
        selectedItem = clickData?.payload;
        break;
      case 'audit':
        modalData = data?.auditFindings || [];
        title = `Audit Findings - ${clickData?.payload?.audit || 'Details'}`;
        selectedItem = clickData?.payload;
        break;
    }

    setDrillDownModal({
      isOpen: true,
      title,
      type: chartType,
      data: modalData,
      selectedItem
    });
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

  // Prepare data for scatter chart (deviation correlation)
  const scatterData = data?.deviations?.map(item => ({
    total: item.total,
    critical: item.critical,
    major: item.major,
    date: item.date,
    category: item.category
  })) || [];

  // Prepare data for radar chart (site performance)
  const radarData = data?.manufacturingSites?.map(item => ({
    subject: item.site.split(' - ')[0], // Shorten site names
    deviations: 100 - (item.deviations / 2), // Invert and scale for better viz
    compliance: item.compliance,
    efficiency: item.efficiency,
    capa: 100 - (item.capa * 2) // Invert and scale
  })) || [];

  // Chart data configuration with drill-down functionality
  const chartData = {
    'deviation-trends': {
      title: "Deviation Trends",
      data: data.deviations,
      component: (
        <div
          onClick={() => handleChartClick('deviation', {})}
          className="cursor-pointer"
        >
          <LineChart
            data={filterDataByDate(data.deviations)}
            dataKeys={['total', 'critical', 'major']}
            colors={['hsl(var(--chart-primary))', 'hsl(var(--chart-danger))', 'hsl(var(--chart-warning))']}
            height={350}
          />
        </div>
      )
    },
    'capa-status': {
      title: "CAPA Status Overview",
      data: data.capa,
      component: (
        <div
          onClick={() => handleChartClick('capa', {})}
          className="cursor-pointer"
        >
          <AreaChart
            data={filterDataByDate(data.capa)}
            dataKeys={['open', 'inProgress', 'closed', 'overdue']}
            colors={['hsl(var(--chart-warning))', 'hsl(var(--chart-info))', 'hsl(var(--chart-success))', 'hsl(var(--chart-danger))']}
            height={350}
            stacked={true}
          />
        </div>
      )
    },
    'compliance-metrics': {
      title: "Compliance Metrics",
      data: data.compliance,
      component: (
        <div
          onClick={() => handleChartClick('compliance', {})}
          className="cursor-pointer"
        >
          <BarChart
            data={filterDataByDate(data.compliance)}
            dataKeys={['gmp', 'fda', 'iso']}
            colors={['hsl(var(--chart-primary))', 'hsl(var(--chart-secondary))', 'hsl(var(--chart-accent))']}
            height={350}
          />
        </div>
      )
    },
    'deviation-category': {
      title: "Deviations by Category",
      data: data.deviationsByCategory,
      component: (
        <div
          onClick={() => handleChartClick('deviation', {})}
          className="cursor-pointer"
        >
          <PieChart
            data={data.deviationsByCategory}
            dataKey="value"
            nameKey="name"
            height={350}
          />
        </div>
      )
    },
    'deviation-severity': {
      title: "Deviation vs Critical Correlation",
      data: scatterData,
      component: (
        <div
          onClick={() => handleChartClick('deviation', {})}
          className="cursor-pointer"
        >
          <ScatterChart
            data={scatterData}
            xDataKey="total"
            yDataKey="critical"
            colors={['hsl(var(--chart-danger))']}
            height={350}
          />
        </div>
      )
    },
    'site-performance': {
      title: "Manufacturing Site Performance",
      data: radarData,
      component: (
        <RadarChart
          data={radarData}
          dataKeys={['compliance', 'efficiency', 'deviations']}
          colors={['hsl(var(--chart-primary))', 'hsl(var(--chart-success))', 'hsl(var(--chart-warning))']}
          height={350}
        />
      )
    },
    'audit-findings': {
      title: "Audit Findings Summary",
      data: data.auditFindings,
      component: (
        <div
          onClick={() => handleChartClick('audit', {})}
          className="cursor-pointer"
        >
          <BarChart
            data={data.auditFindings}
            dataKeys={['findings', 'critical']}
            xAxisKey="audit"
            colors={['hsl(var(--chart-info))', 'hsl(var(--chart-danger))']}
            height={400}
          />
        </div>
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

        {/* Pharmaceutical KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-card shadow-card border-dashboard-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Total Deviations</p>
                <p className="text-2xl font-bold text-foreground">
                  {filterDataByDate(data.deviations).reduce((sum, item) => sum + item.total, 0)}
                </p>
              </div>
              <div className="p-3 bg-chart-danger/10 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-chart-danger" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-card shadow-card border-dashboard-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Open CAPAs</p>
                <p className="text-2xl font-bold text-foreground">
                  {filterDataByDate(data.capa).reduce((sum, item) => sum + item.open + item.overdue, 0)}
                </p>
              </div>
              <div className="p-3 bg-chart-warning/10 rounded-lg">
                <Clock className="w-6 h-6 text-chart-warning" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-card shadow-card border-dashboard-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Avg. Compliance</p>
                <p className="text-2xl font-bold text-foreground">
                  {((filterDataByDate(data.compliance).reduce((sum, item) => sum + (item.gmp + item.fda + item.iso) / 3, 0)) / 
                    filterDataByDate(data.compliance).length).toFixed(1)}%
                </p>
              </div>
              <div className="p-3 bg-chart-success/10 rounded-lg">
                <ShieldCheck className="w-6 h-6 text-chart-success" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-card shadow-card border-dashboard-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">CAPA Effectiveness</p>
                <p className="text-2xl font-bold text-foreground">
                  {(filterDataByDate(data.capa).reduce((sum, item) => sum + item.effectiveness, 0) / 
                    filterDataByDate(data.capa).length).toFixed(1)}%
                </p>
              </div>
              <div className="p-3 bg-chart-primary/10 rounded-lg">
                <TrendingUp className="w-6 h-6 text-chart-primary" />
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
          dragHandleClassName="drag-handle"
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

        {/* Drill-down Modal */}
        <DrillDownModal
          isOpen={drillDownModal.isOpen}
          onClose={() => setDrillDownModal(prev => ({ ...prev, isOpen: false }))}
          title={drillDownModal.title}
          type={drillDownModal.type}
          data={drillDownModal.data}
          selectedItem={drillDownModal.selectedItem}
        />
      </div>
    </div>
  );
};

export default Dashboard;