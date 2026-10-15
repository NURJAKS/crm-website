-- Пользователи системы
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'manager', -- 'admin' или 'manager'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Заявки
CREATE TABLE IF NOT EXISTS requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new', -- 'new', 'in_progress', 'closed'
  source TEXT DEFAULT 'website', -- 'website', 'telegram', 'api'
  assigned_to INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (assigned_to) REFERENCES users(id)
);

-- История изменений заявок
CREATE TABLE IF NOT EXISTS request_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  request_id INTEGER NOT NULL,
  user_id INTEGER,
  action TEXT NOT NULL, -- 'created', 'status_changed', 'comment_added', 'assigned'
  old_value TEXT,
  new_value TEXT,
  comment TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (request_id) REFERENCES requests(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Комментарии к заявкам
CREATE TABLE IF NOT EXISTS request_comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  request_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  comment TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (request_id) REFERENCES requests(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Индексы для производительности
CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_created_at ON requests(created_at);
CREATE INDEX IF NOT EXISTS idx_requests_assigned_to ON requests(assigned_to);
CREATE INDEX IF NOT EXISTS idx_request_history_request_id ON request_history(request_id);
CREATE INDEX IF NOT EXISTS idx_request_comments_request_id ON request_comments(request_id);

-- Создание начального админа (пароль: admin123, нужно захешировать)
-- В реальном проекте это должно быть сделано через API или скрипт миграции

