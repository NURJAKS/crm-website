import { useState } from 'react';
import { API_BASE } from '../App';
import './Contacts.css';

export default function Contacts() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch(`${API_BASE}/public/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Ошибка при отправке заявки');
      }

      setSuccess(true);
      setFormData({ name: '', phone: '', email: '', message: '' });
    } catch (err: any) {
      setError(err.message || 'Произошла ошибка');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="contacts-page">
      <div className="container">
        <h1>Свяжитесь с нами</h1>
        <p className="contacts-intro">
          Оставьте заявку, и мы свяжемся с вами в ближайшее время
        </p>

        <div className="contacts-content">
          <div className="contact-form-wrapper">
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Имя *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Ваше имя"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Телефон *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="+7 (999) 123-45-67"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Сообщение</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Опишите вашу задачу или вопрос"
                />
              </div>

              {error && <div className="alert alert-error">{error}</div>}
              {success && (
                <div className="alert alert-success">
                  Спасибо! Ваша заявка успешно отправлена. Мы свяжемся с вами в ближайшее время.
                </div>
              )}

              <button type="submit" className="btn btn-primary btn-large" disabled={loading}>
                {loading ? 'Отправка...' : 'Отправить заявку'}
              </button>
            </form>
          </div>

          <div className="contact-info">
            <h2>Контактная информация</h2>
            <div className="info-item">
              <strong>Email:</strong>
              <p>info@crm-system.com</p>
            </div>
            <div className="info-item">
              <strong>Телефон:</strong>
              <p>+7 (999) 123-45-67</p>
            </div>
            <div className="info-item">
              <strong>Время работы:</strong>
              <p>Пн-Пт: 9:00 - 18:00</p>
            </div>
            <div className="info-item">
              <strong>Telegram:</strong>
              <p>@crm_support</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

