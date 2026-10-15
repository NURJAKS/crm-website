import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import './Layout.css';

export default function Layout() {
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="layout">
      <header className="header">
        <div className="container">
          <Link to="/" className="logo">
            <h1>CRM System</h1>
          </Link>
          <nav className="nav">
            {!isAuthenticated ? (
              <>
                <Link to="/">Главная</Link>
                <Link to="/services">Услуги</Link>
                <Link to="/pricing">Тарифы</Link>
                <Link to="/how-it-works">Как это работает</Link>
                <Link to="/about">О нас</Link>
                <Link to="/blog">Блог</Link>
                <Link to="/contacts">Контакты</Link>
                <Link to="/login" className="btn-primary">Вход</Link>
              </>
            ) : (
              <>
                <Link to="/dashboard">Панель управления</Link>
                <Link to="/requests">Заявки</Link>
                <Link to="/analytics">Аналитика</Link>
                <Link to="/settings">Настройки</Link>
                <div className="user-menu">
                  <button onClick={toggleTheme} className="theme-toggle" title="Переключить тему">
                    {theme === 'light' ? '🌙' : '☀️'}
                  </button>
                  <span>{user?.name}</span>
                  <button onClick={handleLogout} className="btn-secondary">
                    Выход
                  </button>
                </div>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="main">
        <Outlet />
      </main>
      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 CRM System. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
}

