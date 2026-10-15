import { useEffect, useState } from 'react';
import { API_BASE } from '../App';
import './Analytics.css';

interface Stats {
  total: number;
  byStatus: Array<{ status: string; count: number }>;
  last7Days: Array<{ date: string; count: number }>;
  bySource: Array<{ source: string; count: number }>;
}

export default function Analytics() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/analytics/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  }

  const statusNames: Record<string, string> = {
    new: 'Новые',
    in_progress: 'В работе',
    closed: 'Закрытые'
  };

  const statusColors: Record<string, string> = {
    new: '#3b82f6',
    in_progress: '#f59e0b',
    closed: '#10b981'
  };

  if (loading) {
    return (
      <div className="analytics-page">
        <div className="container">
          <div className="loading">Загрузка...</div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="analytics-page">
        <div className="container">
          <div className="error">Ошибка загрузки данных</div>
        </div>
      </div>
    );
  }

  const maxCount = Math.max(...stats.last7Days.map(d => d.count), 1);

  return (
    <div className="analytics-page">
      <div className="container">
        <h1>Аналитика</h1>

        <div className="stats-overview">
          <div className="stat-card large">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Всего заявок</div>
          </div>
        </div>

        <div className="analytics-grid">
          <div className="analytics-card">
            <h2>Распределение по статусам</h2>
            <div className="status-chart">
              {stats.byStatus.map((item) => (
                <div key={item.status} className="status-item">
                  <div className="status-header">
                    <span className="status-name">
                      {statusNames[item.status] || item.status}
                    </span>
                    <span className="status-count">{item.count}</span>
                  </div>
                  <div className="status-bar">
                    <div
                      className="status-bar-fill"
                      style={{
                        width: `${(item.count / stats.total) * 100}%`,
                        backgroundColor: statusColors[item.status]
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="analytics-card">
            <h2>Заявки за последние 7 дней</h2>
            <div className="days-chart">
              {stats.last7Days.map((day) => (
                <div key={day.date} className="day-item">
                  <div
                    className="day-bar"
                    style={{
                      height: `${(day.count / maxCount) * 200}px`,
                      backgroundColor: '#2563eb'
                    }}
                  />
                  <div className="day-label">{day.count}</div>
                  <div className="day-date">
                    {new Date(day.date).toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'short'
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="analytics-card">
            <h2>Распределение по источникам</h2>
            <div className="source-list">
              {stats.bySource.map((item) => (
                <div key={item.source} className="source-item">
                  <span className="source-name">{item.source}</span>
                  <span className="source-count">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

