import { Link } from 'react-router-dom';
import './Blog.css';

const blogPosts = [
  {
    id: 1,
    title: 'Как эффективно управлять заявками',
    excerpt: 'Простые советы по организации работы с клиентскими заявками для малого бизнеса.',
    date: '15 декабря 2024',
    category: 'Советы'
  },
  {
    id: 2,
    title: 'Автоматизация бизнес-процессов',
    excerpt: 'Как автоматизация помогает экономить время и повышать эффективность работы.',
    date: '10 декабря 2024',
    category: 'Автоматизация'
  },
  {
    id: 3,
    title: 'Telegram для бизнеса',
    excerpt: 'Использование Telegram ботов для уведомлений и управления заявками.',
    date: '5 декабря 2024',
    category: 'Интеграции'
  },
  {
    id: 4,
    title: 'Аналитика в CRM системах',
    excerpt: 'Как правильно использовать данные для принятия бизнес-решений.',
    date: '1 декабря 2024',
    category: 'Аналитика'
  }
];

export default function Blog() {
  return (
    <div className="blog-page">
      <div className="container">
        <div className="blog-header">
          <h1>Блог</h1>
          <p>Полезные статьи и советы по управлению бизнесом</p>
        </div>

        <div className="blog-grid">
          {blogPosts.map((post) => (
            <article key={post.id} className="blog-card">
              <div className="blog-category">{post.category}</div>
              <h2>{post.title}</h2>
              <p className="blog-excerpt">{post.excerpt}</p>
              <div className="blog-footer">
                <span className="blog-date">{post.date}</span>
                <Link to={`/blog/${post.id}`} className="blog-link">
                  Читать далее →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

