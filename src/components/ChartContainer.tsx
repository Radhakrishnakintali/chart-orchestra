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
    <Card ref={ref} className={`bg-gradient-card shadow-elevated border-dashboard-border transition-smooth hover:shadow-modal rounded-xl overflow-hidden ${className}`}>
      <div className="p-6 bg-gradient-to-br from-white/50 to-transparent">
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1 mr-4">
            <h3 className="text-xl font-bold text-foreground drag-handle cursor-move mb-1 tracking-tight">{title}</h3>
            <div className="h-1 w-12 bg-gradient-primary rounded-full"></div>
          </div>
          <div 
            className="flex items-center gap-3 relative z-50"
            style={{ pointerEvents: 'auto' }}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            <Select value={selectedOption} onValueChange={handleDateRangeChange}>
              <SelectTrigger className="w-[140px] border-dashboard-border/50 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200 rounded-lg">
                <SelectValue className="text-sm font-medium" />
              </SelectTrigger>
              <SelectContent className="bg-white/95 backdrop-blur-md border-dashboard-border/50 shadow-lg rounded-lg">
                {DATE_RANGE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="hover:bg-chart-primary-bg rounded-md">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              size="sm"
              onMouseDown={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                console.log("Maximize button clicked!");
                setIsMaximized(true);
              }}
              className="border-dashboard-border/50 bg-white/80 hover:bg-chart-primary hover:text-white hover:border-transparent shadow-sm hover:shadow-md transition-all duration-200 rounded-lg"
              style={{ pointerEvents: 'auto', position: 'relative', zIndex: 100 }}
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
                  className="border-dashboard-border/50 bg-white/80 hover:bg-chart-primary hover:text-white hover:border-transparent shadow-sm hover:shadow-md transition-all duration-200 rounded-lg"
                  style={{ pointerEvents: 'auto', position: 'relative', zIndex: 100 }}
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-white/95 backdrop-blur-md border-dashboard-border/50 shadow-lg rounded-lg">
                <DropdownMenuItem onClick={handlePrint} className="cursor-pointer hover:bg-chart-primary-bg rounded-md transition-colors">
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportCSV} className="cursor-pointer hover:bg-chart-primary-bg rounded-md transition-colors">
                  <Download className="w-4 h-4 mr-2" />
                  Download CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportExcel} className="cursor-pointer hover:bg-chart-primary-bg rounded-md transition-colors">
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Download Excel
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div ref={chartRef} className="w-full bg-white/30 rounded-lg p-4 backdrop-blur-sm">
          {React.cloneElement(children as React.ReactElement, { data: filteredData })}
        </div>
      </div>
    </Card>
  );

  return (
    <>
      <ChartContent />
      
      <Dialog open={isMaximized} onOpenChange={setIsMaximized}>
        <DialogContent className="max-w-6xl h-[80vh] bg-gradient-card border-dashboard-border/50 shadow-modal rounded-xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-2xl font-bold text-foreground tracking-tight">{title}</DialogTitle>
                <div className="h-1 w-16 bg-gradient-primary rounded-full mt-2"></div>
              </div>
              <div className="flex items-center gap-3">
                <Select value={selectedOption} onValueChange={handleDateRangeChange}>
                  <SelectTrigger className="w-[140px] border-dashboard-border/50 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200 rounded-lg">
                    <SelectValue className="text-sm font-medium" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 backdrop-blur-md border-dashboard-border/50 shadow-lg rounded-lg">
                    {DATE_RANGE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value} className="hover:bg-chart-primary-bg rounded-md">
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-dashboard-border/50 bg-white/80 hover:bg-chart-primary hover:text-white hover:border-transparent shadow-sm hover:shadow-md transition-all duration-200 rounded-lg"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-white/95 backdrop-blur-md border-dashboard-border/50 shadow-lg rounded-lg">
                    <DropdownMenuItem onClick={handlePrint} className="cursor-pointer hover:bg-chart-primary-bg rounded-md transition-colors">
                      <Printer className="w-4 h-4 mr-2" />
                      Print
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleExportCSV} className="cursor-pointer hover:bg-chart-primary-bg rounded-md transition-colors">
                      <Download className="w-4 h-4 mr-2" />
                      Download CSV
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleExportExcel} className="cursor-pointer hover:bg-chart-primary-bg rounded-md transition-colors">
                      <FileSpreadsheet className="w-4 h-4 mr-2" />
                      Download Excel
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMaximized(false);
                  }}
                  className="border-dashboard-border/50 bg-white/80 hover:bg-chart-danger hover:text-white hover:border-transparent shadow-sm hover:shadow-md transition-all duration-200 rounded-lg"
                >
                  <Minimize2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            <div className="w-full h-full p-6 bg-white/30 rounded-lg backdrop-blur-sm">
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