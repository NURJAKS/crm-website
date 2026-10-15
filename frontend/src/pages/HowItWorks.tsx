import './HowItWorks.css';

export default function HowItWorks() {
  return (
    <div className="how-it-works-page">
      <div className="container">
        <h1>Как это работает</h1>

        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h2>Оставьте заявку</h2>
              <p>
                Клиент заполняет форму на сайте, указывая свои контактные данные 
                и описание потребности. Заявка автоматически попадает в систему.
              </p>
            </div>
          </div>

          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h2>Получение уведомления</h2>
              <p>
                Менеджер получает уведомление о новой заявке в Telegram и в личном 
                кабинете. Заявка получает статус "Новая".
              </p>
            </div>
          </div>

          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h2>Обработка заявки</h2>
              <p>
                Менеджер просматривает заявку в личном кабинете, назначает себя 
                ответственным и меняет статус на "В работе". Может добавить 
                комментарии и заметки.
              </p>
            </div>
          </div>

          <div className="step">
            <div className="step-number">4</div>
            <div className="step-content">
              <h2>Работа с клиентом</h2>
              <p>
                Менеджер связывается с клиентом, уточняет детали и работает над 
                решением его задачи. Все взаимодействия фиксируются в системе.
              </p>
            </div>
          </div>

          <div className="step">
            <div className="step-number">5</div>
            <div className="step-content">
              <h2>Завершение</h2>
              <p>
                После завершения работы менеджер меняет статус заявки на "Закрыта". 
                Вся история работы с заявкой сохраняется для аналитики.
              </p>
            </div>
          </div>

          <div className="step">
            <div className="step-number">6</div>
            <div className="step-content">
              <h2>Аналитика</h2>
              <p>
                Администратор может просматривать статистику по всем заявкам, 
                анализировать эффективность работы и принимать решения на основе данных.
              </p>
            </div>
          </div>
        </div>

        <section className="benefits">
          <h2>Преимущества системы</h2>
          <div className="benefits-grid">
            <div className="benefit">
              <h3>⚡ Быстро</h3>
              <p>Мгновенная обработка заявок и уведомления</p>
            </div>
            <div className="benefit">
              <h3>📱 Удобно</h3>
              <p>Управление через веб-интерфейс и Telegram</p>
            </div>
            <div className="benefit">
              <h3>🔒 Безопасно</h3>
              <p>Защищённое хранение данных и система ролей</p>
            </div>
            <div className="benefit">
              <h3>📊 Прозрачно</h3>
              <p>Полная история и аналитика по всем заявкам</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

