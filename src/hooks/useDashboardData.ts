import { useState, useEffect } from 'react';

export interface DashboardData {
  revenue: Array<{ date: string; value: number; category: string }>;
  userActivity: Array<{ date: string; activeUsers: number; newUsers: number; returningUsers: number }>;
  performanceMetrics: Array<{ date: string; loadTime: number; errorRate: number; uptime: number }>;
  salesByCategory: Array<{ name: string; value: number; percentage: number }>;
  marketingChannels: Array<{ channel: string; visitors: number; conversions: number; cost: number }>;
  regionalSales: Array<{ region: string; sales: number; growth: number }>;
}

export const useDashboardData = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/mock/dashboard-data.json');
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        const dashboardData = await response.json();
        setData(dashboardData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};