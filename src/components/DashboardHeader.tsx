import React, { useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Calendar, 
  Printer, 
  RefreshCw, 
  BarChart3,
  TrendingUp
} from 'lucide-react';
import { DateRange } from '@/hooks/useDateFilter';
import { useReactToPrint } from 'react-to-print';

interface DashboardHeaderProps {
  dateRange: DateRange;
  onDateRangeChange: (dateRange: DateRange) => void;
  onRefresh: () => void;
  dashboardRef: React.RefObject<HTMLDivElement>;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  dateRange,
  onDateRangeChange,
  onRefresh,
  dashboardRef
}) => {
  const handlePrint = useReactToPrint({
    contentRef: dashboardRef,
    documentTitle: `Dashboard_${new Date().toISOString().split('T')[0]}`,
  });

  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    onDateRangeChange({ ...dateRange, [field]: value });
  };

  return (
    <Card className="bg-gradient-card shadow-elevated border-dashboard-border mb-8">
      <div className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-primary rounded-lg shadow-card">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Advanced Analytics Dashboard</h1>
                <p className="text-muted-foreground flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Real-time insights and performance metrics
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-2 p-3 bg-dashboard-bg rounded-lg border border-dashboard-border">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Global Filter:</span>
              <Input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => handleDateChange('startDate', e.target.value)}
                className="w-auto text-sm border-dashboard-border"
              />
              <span className="text-muted-foreground">to</span>
              <Input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => handleDateChange('endDate', e.target.value)}
                className="w-auto text-sm border-dashboard-border"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={onRefresh}
                className="border-dashboard-border hover:bg-chart-primary-bg transition-smooth"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button
                variant="outline"
                onClick={handlePrint}
                className="border-dashboard-border hover:bg-chart-secondary-bg transition-smooth"
              >
                <Printer className="w-4 h-4 mr-2" />
                Print All
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DashboardHeader;