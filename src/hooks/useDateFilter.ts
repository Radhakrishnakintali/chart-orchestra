import { useState, useMemo } from 'react';

export interface DateRange {
  startDate: string;
  endDate: string;
}

export const useDateFilter = (initialRange?: DateRange) => {
  const [dateRange, setDateRange] = useState<DateRange>(
    initialRange || {
      startDate: '2024-01-01',
      endDate: '2024-01-10'
    }
  );

  const filterDataByDate = useMemo(() => {
    return <T extends { date: string }>(data: T[]): T[] => {
      return data.filter(item => {
        const itemDate = new Date(item.date);
        const start = new Date(dateRange.startDate);
        const end = new Date(dateRange.endDate);
        return itemDate >= start && itemDate <= end;
      });
    };
  }, [dateRange]);

  return {
    dateRange,
    setDateRange,
    filterDataByDate
  };
};