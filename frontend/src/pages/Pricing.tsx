import { Link } from 'react-router-dom';
import './Pricing.css';

export default function Pricing() {
  const plans = [
    {
      name: 'Базовый',
      price: 'Бесплатно',
      features: [
        'До 100 заявок в месяц',
        'Базовый личный кабинет',
        'Управление заявками',
        'Email уведомления',
        'Базовая аналитика'
      ],
      popular: false
    },
    {
      name: 'Профессиональный',
      price: '₽2,990',
      period: '/месяц',
      features: [
        'Неограниченное количество заявок',
        'Расширенный личный кабинет',
        'Telegram интеграция',
        'Расширенная аналитика',
        'Экспорт данных',
        'Приоритетная поддержка'
      ],
      popular: true
    },
    {
      name: 'Корпоративный',
      price: 'По запросу',
      features: [
        'Всё из Профессионального',
        'Множество пользователей',
        'Кастомные интеграции',
        'Персональный менеджер',
        'Обучение команды',
        'SLA гарантии'
      ],
      popular: false
    }
  ];

  return (
    <div className="pricing-page">
      <div className="container">
        <div className="pricing-header">
          <h1>Тарифы</h1>
          <p>Выберите план, который подходит вашему бизнесу</p>
        </div>

        <div className="pricing-grid">
          {plans.map((plan, index) => (
            <div key={index} className={`pricing-card ${plan.popular ? 'popular' : ''}`}>
              {plan.popular && <div className="popular-badge">Популярный</div>}
              <h2>{plan.name}</h2>
              <div className="price">
                <span className="price-amount">{plan.price}</span>
                {plan.period && <span className="price-period">{plan.period}</span>}
              </div>
              <ul className="features-list">
                {plan.features.map((feature, i) => (
                  <li key={i}>
                    <span className="check-icon">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link to="/contacts" className="btn btn-primary">
                Начать
              </Link>
            </div>
          ))}
        </div>

        <div className="pricing-faq">
          <h2>Часто задаваемые вопросы</h2>
          <div className="faq-list">
            <div className="faq-item">
              <h3>Можно ли изменить тариф позже?</h3>
              <p>Да, вы можете изменить тариф в любой момент в настройках аккаунта.</p>
            </div>
            <div className="faq-item">
              <h3>Есть ли пробный период?</h3>
              <p>Профессиональный план доступен с 14-дневным пробным периодом.</p>
            </div>
            <div className="faq-item">
              <h3>Какие способы оплаты принимаются?</h3>
              <p>Мы принимаем карты, банковские переводы и электронные кошельки.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

