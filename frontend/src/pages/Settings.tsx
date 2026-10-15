import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { API_BASE } from '../App';
import './Settings.css';

export default function Settings() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    email: true,
    telegram: false,
    newRequests: true,
    statusChanges: true
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Загрузка настроек из localStorage
    const saved = localStorage.getItem('notifications');
    if (saved) {
      setNotifications(JSON.parse(saved));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="settings-page">
      <div className="container">
        <h1>Настройки</h1>

        <div className="settings-grid">
          <div className="settings-section">
            <h2>Профиль</h2>
            <div className="profile-info">
              <div className="info-item">
                <label>Имя:</label>
                <span>{user?.name}</span>
              </div>
              <div className="info-item">
                <label>Email:</label>
                <span>{user?.email}</span>
              </div>
              <div className="info-item">
                <label>Роль:</label>
                <span className="role-badge">{user?.role === 'admin' ? 'Администратор' : 'Менеджер'}</span>
              </div>
            </div>
          </div>

          <div className="settings-section">
            <h2>Внешний вид</h2>
            <div className="theme-setting">
              <label>Тема оформления:</label>
              <div className="theme-options">
                <button
                  className={`theme-option ${theme === 'light' ? 'active' : ''}`}
                  onClick={() => theme !== 'light' && toggleTheme()}
                >
                  ☀️ Светлая
                </button>
                <button
                  className={`theme-option ${theme === 'dark' ? 'active' : ''}`}
                  onClick={() => theme !== 'dark' && toggleTheme()}
                >
                  🌙 Тёмная
                </button>
              </div>
            </div>
          </div>

          <div className="settings-section">
            <h2>Уведомления</h2>
            <div className="notifications-list">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={notifications.newRequests}
                  onChange={(e) => setNotifications({ ...notifications, newRequests: e.target.checked })}
                />
                <span>Уведомления о новых заявках</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={notifications.statusChanges}
                  onChange={(e) => setNotifications({ ...notifications, statusChanges: e.target.checked })}
                />
                <span>Уведомления об изменении статусов</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={notifications.email}
                  onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
                />
                <span>Email уведомления</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={notifications.telegram}
                  onChange={(e) => setNotifications({ ...notifications, telegram: e.target.checked })}
                />
                <span>Telegram уведомления</span>
              </label>
            </div>
            <button onClick={handleSave} className="btn btn-primary">
              Сохранить настройки
            </button>
            {success && <div className="success-message">Настройки сохранены!</div>}
          </div>

          <div className="settings-section">
            <h2>Экспорт данных</h2>
            <p className="section-description">Вы можете экспортировать данные в различных форматах</p>
            <div className="export-buttons">
              <button className="btn btn-secondary" onClick={() => window.location.href = `${API_BASE}/export/csv`}>
                📊 Экспорт CSV
              </button>
              <button className="btn btn-secondary" onClick={() => window.location.href = `${API_BASE}/export/json`}>
                📄 Экспорт JSON
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

