import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ChartContainer from './ChartContainer';
import { DateRange } from '@/hooks/useDateFilter';

interface DraggableChartContainerProps {
  id: string;
  title: string;
  children: React.ReactNode;
  data: any[];
  globalDateRange?: DateRange;
  onGlobalDateChange?: (dateRange: DateRange) => void;
  enableLocalDateFilter?: boolean;
  className?: string;
}

const DraggableChartContainer: React.FC<DraggableChartContainerProps> = ({
  id,
  title,
  children,
  data,
  globalDateRange,
  onGlobalDateChange,
  enableLocalDateFilter = false,
  className = ""
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`${isDragging ? 'z-50' : ''} ${className}`}
    >
      <ChartContainer
        title={title}
        data={data}
        globalDateRange={globalDateRange}
        onGlobalDateChange={onGlobalDateChange}
        enableLocalDateFilter={enableLocalDateFilter}
        className={isDragging ? 'shadow-2xl' : ''}
      >
        {children}
      </ChartContainer>
    </div>
  );
};

export default DraggableChartContainer;