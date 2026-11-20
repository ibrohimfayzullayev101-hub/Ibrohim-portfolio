import { Redis } from '@upstash/redis';
import { isAdmin } from './_auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  if (!isAdmin(req)) return res.status(401).json({ message: 'Unauthorized' });
  const { id, status } = req.body || {};
  const allowed = ['Новая', 'В работе', 'Завершена'];
  if (!id || !allowed.includes(status)) return res.status(400).json({ message: 'Некорректные данные' });
  try {
    const redis = new Redis({ url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN });
    const key = 'ibrohim:orders';
    const orders = await redis.lrange(key, 0, 199);
    const index = orders.findIndex((entry) => {
      const order = typeof entry === 'string' ? JSON.parse(entry) : entry;
      return order.id === id;
    });
    if (index < 0) return res.status(404).json({ message: 'Заявка не найдена' });
    const entry = orders[index];
    const order = typeof entry === 'string' ? JSON.parse(entry) : entry;
    order.status = status;
    await redis.lset(key, index, JSON.stringify(order));
    return res.status(200).json({ ok: true, id, status });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Не удалось обновить статус' });
  }
}
