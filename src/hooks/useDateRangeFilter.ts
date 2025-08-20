import { useState, useMemo } from 'react';
import { subDays, format } from 'date-fns';

export interface DateRange {
  startDate: string;
  endDate: string;
}

export type DateRangeOption = 'last7days' | 'last30days' | 'last60days' | 'last90days' | 'last1year';

export const DATE_RANGE_OPTIONS = [
  { value: 'last7days', label: 'Last 7 days' },
  { value: 'last30days', label: 'Last 30 days' },
  { value: 'last60days', label: 'Last 60 days' },
  { value: 'last90days', label: 'Last 90 days' },
  { value: 'last1year', label: 'Last 1 year' },
] as const;

const getDateRangeFromOption = (option: DateRangeOption): DateRange => {
  const today = new Date();
  const formatDate = (date: Date) => format(date, 'yyyy-MM-dd');
  
  switch (option) {
    case 'last7days':
      return {
        startDate: formatDate(subDays(today, 7)),
        endDate: formatDate(today)
      };
    case 'last30days':
      return {
        startDate: formatDate(subDays(today, 30)),
        endDate: formatDate(today)
      };
    case 'last60days':
      return {
        startDate: formatDate(subDays(today, 60)),
        endDate: formatDate(today)
      };
    case 'last90days':
      return {
        startDate: formatDate(subDays(today, 90)),
        endDate: formatDate(today)
      };
    case 'last1year':
      return {
        startDate: formatDate(subDays(today, 365)),
        endDate: formatDate(today)
      };
    default:
      return {
        startDate: formatDate(subDays(today, 30)),
        endDate: formatDate(today)
      };
  }
};

export const useDateRangeFilter = (initialOption: DateRangeOption = 'last30days') => {
  const [selectedOption, setSelectedOption] = useState<DateRangeOption>(initialOption);
  
  const dateRange = useMemo(() => getDateRangeFromOption(selectedOption), [selectedOption]);
  
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
    selectedOption,
    setSelectedOption,
    dateRange,
    filterDataByDate
  };
};