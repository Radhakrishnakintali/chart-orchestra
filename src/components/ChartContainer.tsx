import React, { useState, useRef, forwardRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  MoreVertical
} from 'lucide-react';
import { exportToExcel, exportToCSV, formatDataForExport } from '@/utils/exportUtils';
import { useDateRangeFilter, DateRange, DATE_RANGE_OPTIONS, DateRangeOption } from '@/hooks/useDateRangeFilter';
import { useReactToPrint } from 'react-to-print';

interface ChartContainerProps {
  title: string;
  children: React.ReactNode;
  data: any[];
  className?: string;
}

const ChartContainer = forwardRef<HTMLDivElement, ChartContainerProps>(({
  title,
  children,
  data,
  className = ""
}, ref) => {
  const [isMaximized, setIsMaximized] = useState(false);
  
  console.log("ChartContainer rendered, isMaximized:", isMaximized);
  const chartRef = useRef<HTMLDivElement>(null);
  
  const { 
    selectedOption,
    setSelectedOption,
    filterDataByDate 
  } = useDateRangeFilter('last30days');

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

  const handleDateRangeChange = (value: DateRangeOption) => {
    setSelectedOption(value);
  };

  const ChartContent = () => (
    <Card ref={ref} className={`bg-dashboard-card shadow-card border-dashboard-border transition-smooth ${className}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground drag-handle cursor-move flex-1 mr-4">{title}</h3>
          <div className="flex items-center gap-2 pointer-events-auto relative z-10">
            <Select value={selectedOption} onValueChange={handleDateRangeChange}>
              <SelectTrigger className="w-[140px] border-dashboard-border bg-dashboard-card">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-dashboard-card border-dashboard-border">
                {DATE_RANGE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                console.log("Maximize button clicked!");
                setIsMaximized(true);
              }}
              className="border-dashboard-border hover:bg-chart-primary-bg pointer-events-auto"
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => e.stopPropagation()}
                  className="border-dashboard-border hover:bg-chart-primary-bg"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-dashboard-card border-dashboard-border">
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
        
        <div ref={chartRef} className="w-full">
          {React.cloneElement(children as React.ReactElement, { data: filteredData })}
        </div>
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
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMaximized(false);
                }}
                className="border-dashboard-border hover:bg-chart-primary-bg"
              >
                <Minimize2 className="w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            <div className="w-full h-full p-4">
              {React.cloneElement(children as React.ReactElement, { data: filteredData })}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
});

ChartContainer.displayName = 'ChartContainer';

export default ChartContainer;