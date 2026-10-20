import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE } from '../App';
import './RequestDetail.css';

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

interface Comment {
  id: number;
  comment: string;
  user_name: string;
  created_at: string;
}

interface History {
  id: number;
  action: string;
  old_value: string | null;
  new_value: string | null;
  comment: string | null;
  user_name: string | null;
  created_at: string;
}

export default function RequestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState<Request | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [history, setHistory] = useState<History[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      fetchRequest();
    }
  }, [id]);

  async function fetchRequest() {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/requests/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRequest(data.request);
        setComments(data.comments || []);
        setHistory(data.history || []);
        setStatus(data.request.status);
      }
    } catch (error) {
      console.error('Error fetching request:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(newStatus: string) {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/requests/${id}/status`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setStatus(newStatus);
        if (request) {
          setRequest({ ...request, status: newStatus });
        }
        fetchRequest(); // Обновляем историю
      }
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setSaving(false);
    }
  }

  async function handleAddComment() {
    if (!newComment.trim()) return;

    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/requests/${id}/comments`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ comment: newComment }),
      });

      if (response.ok) {
        setNewComment('');
        fetchRequest();
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setSaving(false);
    }
  }



  if (loading) {
    return (
      <div className="request-detail-page">
        <div className="container">
          <div className="loading">Загрузка...</div>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="request-detail-page">
        <div className="container">
          <div className="error">Заявка не найдена</div>
        </div>
      </div>
    );
  }

  return (
    <div className="request-detail-page">
      <div className="container">
        <button onClick={() => navigate('/requests')} className="back-btn">
          ← Назад к списку
        </button>

        <div className="request-detail">
          <div className="request-main">
            <div className="request-header">
              <h1>Заявка #{request.id}</h1>
              <div className="status-selector">
                <label>Статус:</label>
                <select
                  value={status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  disabled={saving}
                  className="status-select"
                >
                  <option value="new">Новая</option>
                  <option value="in_progress">В работе</option>
                  <option value="closed">Закрыта</option>
                </select>
              </div>
            </div>

            <div className="request-info-card">
              <h2>Информация о клиенте</h2>
              <div className="info-grid">
                <div className="info-item">
                  <label>Имя:</label>
                  <span>{request.name}</span>
                </div>
                <div className="info-item">
                  <label>Телефон:</label>
                  <span>{request.phone}</span>
                </div>
                {request.email && (
                  <div className="info-item">
                    <label>Email:</label>
                    <span>{request.email}</span>
                  </div>
                )}
                <div className="info-item">
                  <label>Источник:</label>
                  <span>{request.source}</span>
                </div>
                <div className="info-item">
                  <label>Создана:</label>
                  <span>
                    {new Date(request.created_at).toLocaleString('ru-RU')}
                  </span>
                </div>
                <div className="info-item">
                  <label>Обновлена:</label>
                  <span>
                    {new Date(request.updated_at).toLocaleString('ru-RU')}
                  </span>
                </div>
              </div>
            </div>

            {request.message && (
              <div className="request-message-card">
                <h2>Сообщение</h2>
                <p>{request.message}</p>
              </div>
            )}

            <div className="comments-section">
              <h2>Комментарии</h2>
              <div className="comments-list">
                {comments.map((comment) => (
                  <div key={comment.id} className="comment">
                    <div className="comment-header">
                      <strong>{comment.user_name}</strong>
                      <span className="comment-date">
                        {new Date(comment.created_at).toLocaleString('ru-RU')}
                      </span>
                    </div>
                    <p className="comment-text">{comment.comment}</p>
                  </div>
                ))}
                {comments.length === 0 && (
                  <p className="no-comments">Комментариев пока нет</p>
                )}
              </div>
              <div className="add-comment">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Добавить комментарий..."
                  rows={3}
                />
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim() || saving}
                  className="btn btn-primary"
                >
                  {saving ? 'Сохранение...' : 'Добавить комментарий'}
                </button>
              </div>
            </div>
          </div>

          <div className="request-sidebar">
            <div className="history-card">
              <h2>История изменений</h2>
              <div className="history-list">
                {history.map((item) => (
                  <div key={item.id} className="history-item">
                    <div className="history-time">
                      {new Date(item.created_at).toLocaleString('ru-RU')}
                    </div>
                    <div className="history-action">
                      {item.user_name && <strong>{item.user_name}</strong>}
                      {item.action === 'created' && ' создал заявку'}
                      {item.action === 'status_changed' && 
                        ` изменил статус: ${item.old_value} → ${item.new_value}`}
                      {item.action === 'comment_added' && ' добавил комментарий'}
                      {item.action === 'assigned' && ' назначил ответственного'}
                    </div>
                    {item.comment && (
                      <div className="history-comment">{item.comment}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

