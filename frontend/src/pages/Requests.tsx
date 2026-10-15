import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE } from '../App';
import './Requests.css';

interface Request {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  message: string | null;
  status: string;
  source: string;
  created_at: string;
  updated_at: string;
}

export default function Requests() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    fetchRequests();
  }, [statusFilter]);

  async function fetchRequests() {
    try {
      const token = localStorage.getItem('token');
      const url = `${API_BASE}/requests${statusFilter ? `?status=${statusFilter}` : ''}`;
      
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRequests(data.requests || []);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  }

  const statusNames: Record<string, string> = {
    new: 'Новая',
    in_progress: 'В работе',
    closed: 'Закрыта'
  };

  const statusColors: Record<string, string> = {
    new: '#3b82f6',
    in_progress: '#f59e0b',
    closed: '#10b981'
  };

  if (loading) {
    return (
      <div className="requests-page">
        <div className="container">
          <div className="loading">Загрузка...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="requests-page">
      <div className="container">
        <div className="requests-header">
          <h1>Заявки</h1>
          <div className="header-controls">
            <div className="search-box">
              <input
                type="text"
                placeholder="Поиск по имени, телефону, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="filters">
              <button
                className={`filter-btn ${statusFilter === '' ? 'active' : ''}`}
                onClick={() => setStatusFilter('')}
              >
                Все
              </button>
              <button
                className={`filter-btn ${statusFilter === 'new' ? 'active' : ''}`}
                onClick={() => setStatusFilter('new')}
              >
                Новые
              </button>
              <button
                className={`filter-btn ${statusFilter === 'in_progress' ? 'active' : ''}`}
                onClick={() => setStatusFilter('in_progress')}
              >
                В работе
              </button>
              <button
                className={`filter-btn ${statusFilter === 'closed' ? 'active' : ''}`}
                onClick={() => setStatusFilter('closed')}
              >
                Закрытые
              </button>
            </div>
          </div>
        </div>

        {requests.length === 0 ? (
          <div className="empty-state">
            <p>Заявок пока нет</p>
          </div>
        ) : (
          <div className="requests-list">
            {requests
              .filter((request) => {
                if (!searchQuery) return true;
                const query = searchQuery.toLowerCase();
                return (
                  request.name.toLowerCase().includes(query) ||
                  request.phone.includes(query) ||
                  (request.email && request.email.toLowerCase().includes(query)) ||
                  (request.message && request.message.toLowerCase().includes(query))
                );
              })
              .map((request) => (
              <Link
                key={request.id}
                to={`/requests/${request.id}`}
                className="request-card"
              >
                <div className="request-header">
                  <div className="request-id">#{request.id}</div>
                  <div
                    className="request-status"
                    style={{ backgroundColor: statusColors[request.status] }}
                  >
                    {statusNames[request.status]}
                  </div>
                </div>
                <div className="request-body">
                  <h3>{request.name}</h3>
                  <div className="request-info">
                    <span>📞 {request.phone}</span>
                    {request.email && <span>✉️ {request.email}</span>}
                  </div>
                  {request.message && (
                    <p className="request-message">{request.message}</p>
                  )}
                </div>
                <div className="request-footer">
                  <span className="request-date">
                    {new Date(request.created_at).toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                  <span className="request-source">{request.source}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

