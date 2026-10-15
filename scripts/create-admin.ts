/**
 * Скрипт для создания первого администратора
 * Использование: npx tsx scripts/create-admin.ts
 * 
 * ВАЖНО: Перед использованием настройте переменные окружения
 */

import { hashPassword } from '../src/worker/utils/auth';

async function createAdmin() {
  const email = process.env.ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const name = process.env.ADMIN_NAME || 'Администратор';

  const passwordHash = await hashPassword(password);

  console.log('\n=== Создание администратора ===\n');
  console.log('Email:', email);
  console.log('Имя:', name);
  console.log('Пароль:', password);
  console.log('\nSQL запрос для выполнения:\n');
  
  console.log(`INSERT INTO users (email, password_hash, name, role) VALUES (
  '${email}',
  '${passwordHash}',
  '${name}',
  'admin'
);\n`);

  console.log('Или используйте API:\n');
  console.log(`curl -X POST http://localhost:8787/api/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "${email}",
    "password": "${password}",
    "name": "${name}",
    "role": "admin"
  }'\n`);
}

createAdmin().catch(console.error);

