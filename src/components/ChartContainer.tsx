import React, { useState, useRef, forwardRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Maximize2, 
  Minimize2, 
  Download, 
  FileSpreadsheet, 
  Printer, 
  Calendar as CalendarIcon,
  MoreVertical,
  Filter
} from 'lucide-react';
import { format } from 'date-fns';
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
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);
  const [tempStartDate, setTempStartDate] = useState<Date | undefined>();
  const [tempEndDate, setTempEndDate] = useState<Date | undefined>();
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

  const handleOpenDateFilter = () => {
    setTempStartDate(new Date(currentDateRange.startDate));
    setTempEndDate(new Date(currentDateRange.endDate));
    setIsDateFilterOpen(true);
  };

  const handleApplyDateFilter = () => {
    if (tempStartDate && tempEndDate) {
      const newRange = {
        startDate: format(tempStartDate, 'yyyy-MM-dd'),
        endDate: format(tempEndDate, 'yyyy-MM-dd')
      };
      if (enableLocalDateFilter) {
        setLocalDateRange(newRange);
      } else if (onGlobalDateChange) {
        onGlobalDateChange(newRange);
      }
    }
    setIsDateFilterOpen(false);
  };

  const handleCancelDateFilter = () => {
    setIsDateFilterOpen(false);
    setTempStartDate(undefined);
    setTempEndDate(undefined);
  };

  const ChartContent = () => (
    <Card ref={ref} className={`bg-dashboard-card shadow-card border-dashboard-border transition-smooth ${className}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <div className="flex items-center gap-2">
            {!isMaximized ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsMaximized(true)}
                className="border-dashboard-border hover:bg-chart-primary-bg"
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsMaximized(false)}
                className="border-dashboard-border hover:bg-chart-primary-bg"
              >
                <Minimize2 className="w-4 h-4" />
              </Button>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-dashboard-border hover:bg-chart-primary-bg"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-dashboard-card border-dashboard-border">
                <DropdownMenuItem onClick={handleOpenDateFilter} className="cursor-pointer">
                  <Filter className="w-4 h-4 mr-2" />
                  Date Filter
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handlePrint} className="cursor-pointer">
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportCSV} className="cursor-pointer">
                  <Download className="w-4 h-4 mr-2" />
                  Download CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportExcel} className="cursor-pointer">
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Download Excel
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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

      <Dialog open={isDateFilterOpen} onOpenChange={setIsDateFilterOpen}>
        <DialogContent className="sm:max-w-md bg-dashboard-card border-dashboard-border">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Date Filter</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Start Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal border-dashboard-border"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {tempStartDate ? format(tempStartDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-dashboard-card border-dashboard-border" align="start">
                  <Calendar
                    mode="single"
                    selected={tempStartDate}
                    onSelect={setTempStartDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">End Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal border-dashboard-border"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {tempEndDate ? format(tempEndDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-dashboard-card border-dashboard-border" align="start">
                  <Calendar
                    mode="single"
                    selected={tempEndDate}
                    onSelect={setTempEndDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={handleCancelDateFilter}
              className="border-dashboard-border"
            >
              Cancel
            </Button>
            <Button
              onClick={handleApplyDateFilter}
              className="bg-chart-primary text-white hover:bg-chart-primary/90"
            >
              Apply
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
});

ChartContainer.displayName = 'ChartContainer';

export default ChartContainer;