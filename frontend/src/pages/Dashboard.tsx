import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE } from '../App';
import { useAuth } from '../contexts/AuthContext';
import './Dashboard.css';

interface Stats {
  total: number;
  byStatus: Array<{ status: string; count: number }>;
  last7Days: Array<{ date: string; count: number }>;
  bySource: Array<{ source: string; count: number }>;
}

export default function Dashboard() {
  const { user } = useAuth();
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
      <div className="dashboard">
        <div className="container">
          <div className="loading">Загрузка...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Панель управления</h1>
          <p>Добро пожаловать, {user?.name}!</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{stats?.total || 0}</div>
            <div className="stat-label">Всего заявок</div>
          </div>

          {stats?.byStatus.map((item) => (
            <div key={item.status} className="stat-card">
              <div 
                className="stat-value" 
                style={{ color: statusColors[item.status] }}
              >
                {item.count}
              </div>
              <div className="stat-label">{statusNames[item.status] || item.status}</div>
            </div>
          ))}
        </div>

        <div className="dashboard-actions">
          <Link to="/requests" className="action-card">
            <div className="action-icon">📋</div>
            <h3>Управление заявками</h3>
            <p>Просмотр и обработка всех заявок</p>
          </Link>

          <Link to="/analytics" className="action-card">
            <div className="action-icon">📊</div>
            <h3>Аналитика</h3>
            <p>Подробная статистика и отчёты</p>
          </Link>
        </div>

        {stats && stats.last7Days.length > 0 && (
          <div className="recent-activity">
            <h2>Активность за последние 7 дней</h2>
            <div className="activity-chart">
              {stats.last7Days.map((day) => (
                <div key={day.date} className="activity-bar">
                  <div 
                    className="bar" 
                    style={{ height: `${(day.count / (stats.total || 1)) * 200}px` }}
                  />
                  <div className="bar-label">{day.count}</div>
                  <div className="bar-date">
                    {new Date(day.date).toLocaleDateString('ru-RU', { 
                      day: 'numeric', 
                      month: 'short' 
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

