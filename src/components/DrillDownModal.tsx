import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, AlertTriangle, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import BarChart from '@/charts/BarChart';
import LineChart from '@/charts/LineChart';
import PieChart from '@/charts/PieChart';

interface DrillDownModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  type: 'deviation' | 'capa' | 'compliance' | 'audit';
  data: any;
  selectedItem?: any;
}

const DrillDownModal: React.FC<DrillDownModalProps> = ({
  isOpen,
  onClose,
  title,
  type,
  data,
  selectedItem
}) => {
  const renderDeviationDetails = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-chart-danger" />
            <span className="font-semibold">Critical</span>
          </div>
          <p className="text-2xl font-bold">{selectedItem?.critical || 0}</p>
          <p className="text-sm text-muted-foreground">Immediate Action Required</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-chart-warning" />
            <span className="font-semibold">Major</span>
          </div>
          <p className="text-2xl font-bold">{selectedItem?.major || 0}</p>
          <p className="text-sm text-muted-foreground">Action Within 24hrs</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-chart-success" />
            <span className="font-semibold">Minor</span>
          </div>
          <p className="text-2xl font-bold">{selectedItem?.minor || 0}</p>
          <p className="text-sm text-muted-foreground">Routine Follow-up</p>
        </Card>
      </div>
      
      <Card className="p-4">
        <h4 className="font-semibold mb-4">Category Breakdown</h4>
        <PieChart
          data={[
            { name: 'Critical', value: selectedItem?.critical || 0 },
            { name: 'Major', value: selectedItem?.major || 0 },
            { name: 'Minor', value: selectedItem?.minor || 0 }
          ]}
          dataKey="value"
          nameKey="name"
          colors={['hsl(var(--chart-danger))', 'hsl(var(--chart-warning))', 'hsl(var(--chart-success))']}
          height={250}
        />
      </Card>
    </div>
  );

  const renderCapaDetails = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-chart-warning">{selectedItem?.open || 0}</p>
            <p className="text-sm text-muted-foreground">Open</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-chart-info">{selectedItem?.inProgress || 0}</p>
            <p className="text-sm text-muted-foreground">In Progress</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-chart-success">{selectedItem?.closed || 0}</p>
            <p className="text-sm text-muted-foreground">Closed</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-chart-danger">{selectedItem?.overdue || 0}</p>
            <p className="text-sm text-muted-foreground">Overdue</p>
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <h4 className="font-semibold mb-4">CAPA Status Distribution</h4>
        <BarChart
          data={[{
            status: 'Status',
            Open: selectedItem?.open || 0,
            'In Progress': selectedItem?.inProgress || 0,
            Closed: selectedItem?.closed || 0,
            Overdue: selectedItem?.overdue || 0
          }]}
          dataKeys={['Open', 'In Progress', 'Closed', 'Overdue']}
          xAxisKey="status"
          colors={['hsl(var(--chart-warning))', 'hsl(var(--chart-info))', 'hsl(var(--chart-success))', 'hsl(var(--chart-danger))']}
          height={250}
        />
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold">CAPA Effectiveness</h4>
          <Badge variant={selectedItem?.effectiveness >= 85 ? 'default' : 'destructive'}>
            {selectedItem?.effectiveness || 0}%
          </Badge>
        </div>
        <div className="w-full bg-muted rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-chart-success to-chart-primary h-3 rounded-full transition-all duration-300"
            style={{ width: `${selectedItem?.effectiveness || 0}%` }}
          />
        </div>
      </Card>
    </div>
  );

  const renderComplianceDetails = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {['gmp', 'fda', 'iso', 'internal', 'training'].map((metric) => (
          <Card key={metric} className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{selectedItem?.[metric]?.toFixed(1) || '0.0'}%</p>
              <p className="text-sm text-muted-foreground capitalize">{metric === 'gmp' ? 'GMP' : metric === 'fda' ? 'FDA' : metric === 'iso' ? 'ISO' : metric}</p>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-4">
        <h4 className="font-semibold mb-4">Compliance Metrics Trend</h4>
        <LineChart
          data={data}
          dataKeys={['gmp', 'fda', 'iso', 'internal', 'training']}
          colors={[
            'hsl(var(--chart-primary))',
            'hsl(var(--chart-secondary))',
            'hsl(var(--chart-accent))',
            'hsl(var(--chart-success))',
            'hsl(var(--chart-info))'
          ]}
          height={300}
        />
      </Card>
    </div>
  );

  const renderAuditDetails = () => (
    <div className="space-y-6">
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold">{selectedItem?.audit}</h4>
          <Badge variant={selectedItem?.status === 'closed' ? 'default' : selectedItem?.status === 'open' ? 'destructive' : 'secondary'}>
            {selectedItem?.status}
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-chart-danger">{selectedItem?.critical || 0}</p>
            <p className="text-sm text-muted-foreground">Critical Findings</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-chart-warning">{selectedItem?.observations || 0}</p>
            <p className="text-sm text-muted-foreground">Observations</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{selectedItem?.findings || 0}</p>
            <p className="text-sm text-muted-foreground">Total Findings</p>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (type) {
      case 'deviation':
        return renderDeviationDetails();
      case 'capa':
        return renderCapaDetails();
      case 'compliance':
        return renderComplianceDetails();
      case 'audit':
        return renderAuditDetails();
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
              <DialogDescription>
                Detailed analysis and breakdown
              </DialogDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="border-dashboard-border hover:bg-chart-primary-bg"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="mt-6">
          {renderContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DrillDownModal;