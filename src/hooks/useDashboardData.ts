import { useState, useEffect } from 'react';

export interface DashboardData {
  deviations: Array<{ date: string; total: number; critical: number; major: number; minor: number; category: string }>;
  capa: Array<{ date: string; open: number; inProgress: number; closed: number; overdue: number; effectiveness: number }>;
  compliance: Array<{ date: string; gmp: number; fda: number; iso: number; internal: number; training: number }>;
  deviationsByCategory: Array<{ name: string; value: number; percentage: number; critical: number; major: number; minor: number }>;
  manufacturingSites: Array<{ site: string; deviations: number; compliance: number; capa: number; efficiency: number }>;
  auditFindings: Array<{ audit: string; findings: number; critical: number; observations: number; status: string; date: string }>;
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