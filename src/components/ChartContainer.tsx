import React, { useState, useRef, forwardRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { 
  Maximize2, 
  Minimize2, 
  Download, 
  FileSpreadsheet, 
  Printer, 
  Calendar,
  X
} from 'lucide-react';
import { exportToExcel, exportToCSV, formatDataForExport } from '@/utils/exportUtils';
import { useDateFilter, DateRange } from '@/hooks/useDateFilter';
import { useReactToPrint } from 'react-to-print';

interface ChartContainerProps {
  title: string;
  children: React.ReactNode;
  data: any[];
  globalDateRange?: DateRange;
  onGlobalDateChange?: (dateRange: DateRange) => void;
  enableLocalDateFilter?: boolean;
  className?: string;
}

const ChartContainer = forwardRef<HTMLDivElement, ChartContainerProps>(({
  title,
  children,
  data,
  globalDateRange,
  onGlobalDateChange,
  enableLocalDateFilter = false,
  className = ""
}, ref) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);
  
  const { 
    dateRange: localDateRange, 
    setDateRange: setLocalDateRange, 
    filterDataByDate 
  } = useDateFilter(globalDateRange);

  const currentDateRange = enableLocalDateFilter ? localDateRange : (globalDateRange || localDateRange);
  const filteredData = filterDataByDate(data);

  const handlePrint = useReactToPrint({
    contentRef: chartRef,
    documentTitle: `${title} - Chart Export`,
  });

  const handleExportExcel = () => {
    const exportData = formatDataForExport(filteredData, title);
    exportToExcel(exportData, `${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}`);
  };

  const handleExportCSV = () => {
    const exportData = formatDataForExport(filteredData, title);
    exportToCSV(exportData, `${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}`);
  };

  const handleDateRangeChange = (field: 'startDate' | 'endDate', value: string) => {
    const newRange = { ...currentDateRange, [field]: value };
    if (enableLocalDateFilter) {
      setLocalDateRange(newRange);
    } else if (onGlobalDateChange) {
      onGlobalDateChange(newRange);
    }
  };

  const ChartContent = () => (
    <Card ref={ref} className={`bg-dashboard-card shadow-card border-dashboard-border transition-smooth ${className}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <div className="flex items-center gap-2">
            {enableLocalDateFilter && (
              <div className="flex items-center gap-2 mr-4">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <Input
                  type="date"
                  value={currentDateRange.startDate}
                  onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
                  className="w-auto text-sm"
                />
                <span className="text-muted-foreground">to</span>
                <Input
                  type="date"
                  value={currentDateRange.endDate}
                  onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
                  className="w-auto text-sm"
                />
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="border-dashboard-border hover:bg-chart-primary-bg"
            >
              <Printer className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              className="border-dashboard-border hover:bg-chart-secondary-bg"
            >
              <Download className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportExcel}
              className="border-dashboard-border hover:bg-chart-accent-bg"
            >
              <FileSpreadsheet className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="border-dashboard-border hover:bg-chart-primary-bg"
            >
              <Minimize2 className="w-4 h-4" />
            </Button>
            {!isMaximized ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsMaximized(true)}
                className="border-dashboard-border hover:bg-chart-primary-bg"
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
            ) : null}
          </div>
        </div>
        
        {!isMinimized && (
          <div ref={chartRef} className="w-full">
            {children}
          </div>
        )}
      </div>
    </Card>
  );

  return (
    <>
      <ChartContent />
      
      <Dialog open={isMaximized} onOpenChange={setIsMaximized}>
        <DialogContent className="max-w-6xl h-[80vh] bg-dashboard-card border-dashboard-border">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsMaximized(false)}
                className="border-dashboard-border hover:bg-chart-primary-bg"
              >
                <Minimize2 className="w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            <div className="w-full h-full p-4">
              {children}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
});

ChartContainer.displayName = 'ChartContainer';

export default ChartContainer;