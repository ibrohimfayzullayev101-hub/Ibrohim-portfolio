IBROHIM.DEV — PHONE + ADMIN PANEL SETUP

Features:
- order.html has a required phone number field.
- Every order is saved to Upstash Redis and sent to your Telegram group.
- admin.html is a password-protected dashboard; view orders and update their status.

Vercel setup:
1. Push the project to GitHub and deploy/import it in Vercel.
2. Create a free Upstash Redis database. Copy its REST URL and REST token.
3. In Vercel → Project → Settings → Environment Variables add:
   TELEGRAM_BOT_TOKEN = token from @BotFather
   TELEGRAM_CHAT_ID = numeric ID of your Telegram group (bot must be in group)
   UPSTASH_REDIS_REST_URL = Upstash REST URL
   UPSTASH_REDIS_REST_TOKEN = Upstash REST token
   ADMIN_PASSWORD = your own strong password for admin panel
   SESSION_SECRET = a random secret of at least 32 characters
4. Redeploy the Vercel project after saving variables.
5. Public order form: https://YOUR-DOMAIN/order.html
6. Private admin dashboard: https://YOUR-DOMAIN/admin.html

IMPORTANT: Do not put the Telegram bot token or admin password in HTML/JS files or public GitHub. API functions work on Vercel, not by opening files with Live Server.


Исправления: кнопка заказа переводится вместе с сайтом; выбранный язык сохраняется при переходе между страницами. Статус заказа обновляется точечно в Redis, без удаления и пересоздания всего списка заявок.
