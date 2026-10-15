import './About.css';

export default function About() {
  return (
    <div className="about-page">
      <div className="container">
        <div className="about-hero">
          <h1>О нас</h1>
          <p className="hero-subtitle">
            Мы создаём простые и эффективные решения для управления бизнесом
          </p>
        </div>

        <section className="about-section">
          <h2>Наша миссия</h2>
          <p>
            Мы верим, что каждый бизнес, независимо от размера, заслуживает качественных 
            инструментов для управления заявками и клиентами. Наша цель - сделать CRM-системы 
            доступными, понятными и эффективными.
          </p>
        </section>

        <section className="about-section">
          <h2>Почему мы</h2>
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">🚀</div>
              <h3>Современные технологии</h3>
              <p>Используем последние технологии для быстрой и надёжной работы</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">💡</div>
              <h3>Простота использования</h3>
              <p>Интуитивный интерфейс, не требующий обучения</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🔒</div>
              <h3>Безопасность</h3>
              <p>Ваши данные защищены современными методами шифрования</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">⚡</div>
              <h3>Скорость</h3>
              <p>Мгновенная работа благодаря Cloudflare инфраструктуре</p>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>Технологии</h2>
          <div className="tech-stack">
            <div className="tech-item">
              <strong>Frontend:</strong> React, TypeScript, Vite
            </div>
            <div className="tech-item">
              <strong>Backend:</strong> Cloudflare Workers
            </div>
            <div className="tech-item">
              <strong>Database:</strong> Cloudflare D1 (SQLite)
            </div>
            <div className="tech-item">
              <strong>Deployment:</strong> Cloudflare Pages + Workers
            </div>
            <div className="tech-item">
              <strong>Integrations:</strong> Telegram Bot API
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>Команда</h2>
          <p>
            Мы - команда разработчиков, увлечённых созданием качественных продуктов. 
            Наш опыт в веб-разработке и облачных технологиях позволяет создавать решения, 
            которые действительно работают.
          </p>
        </section>
      </div>
    </div>
  );
}

