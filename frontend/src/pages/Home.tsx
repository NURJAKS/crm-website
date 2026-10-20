import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="container">
          <h1>CRM система для управления заявками</h1>
          <p className="hero-subtitle">
            Лёгкая система для приёма заявок, управления клиентами и автоматизации 
            базовых бизнес-процессов
          </p>
          <div className="hero-actions">
            <Link to="/contacts" className="btn btn-primary">
              Оставить заявку
            </Link>
            <Link to="/how-it-works" className="btn btn-secondary">
              Узнать больше
            </Link>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2>Возможности системы</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📋</div>
              <h3>Управление заявками</h3>
              <p>
                Приём и обработка заявок в едином интерфейсе. 
                Отслеживание статусов и истории изменений.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3>Управление клиентами</h3>
              <p>
                Базовая CRM-логика для работы с клиентами. 
                Хранение контактов и истории взаимодействий.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Аналитика</h3>
              <p>
                Простая аналитика по заявкам: статистика по статусам, 
                источникам и динамика за период.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🤖</div>
              <h3>Telegram интеграция</h3>
              <p>
                Уведомления о новых заявках в Telegram. 
                Быстрое управление заявками прямо из бота.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔐</div>
              <h3>Безопасность</h3>
              <p>
                Система ролей и прав доступа. 
                Администраторы и менеджеры с разными уровнями доступа.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Быстрая работа</h3>
              <p>
                Развёртывание на Cloudflare Workers. 
                Высокая скорость работы и доступность.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <h2>Готовы начать?</h2>
          <p>Оставьте заявку и мы свяжемся с вами</p>
          <Link to="/contacts" className="btn btn-primary btn-large">
            Связаться с нами
          </Link>
        </div>
      </section>
    </div>
  );
}

