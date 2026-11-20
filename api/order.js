// Vercel serverless function: stores the order and sends Telegram notification.
import { Redis } from '@upstash/redis';
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok:false, message:'Method not allowed' });
  const token=process.env.TELEGRAM_BOT_TOKEN, chatId=process.env.TELEGRAM_CHAT_ID;
  const redisUrl=process.env.UPSTASH_REDIS_REST_URL, redisToken=process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!token || !chatId || !redisUrl || !redisToken) return res.status(500).json({ok:false,message:'Server is not configured'});
  const body=req.body||{}; if(body.company_website) return res.status(200).json({ok:true});
  const name=String(body.name||'').trim().slice(0,80), phone=String(body.phone||'').trim().slice(0,25);
  const telegram=String(body.telegram||'').trim().slice(0,80), type=String(body.type||'').trim().slice(0,80);
  const budget=String(body.budget||'Kelishiladi').trim().slice(0,80), description=String(body.description||'').trim().slice(0,1800);
  if(name.length<2 || phone.length<7 || !type || description.length<15) return res.status(400).json({ok:false,message:'Заполните имя, телефон, тип сайта и описание (минимум 15 символов).'});
  const order={id:globalThis.crypto.randomUUID(),name,phone,telegram,type,budget,description,status:'Новая',createdAt:new Date().toISOString()};
  const escapeHtml=v=>String(v).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
  const message=['🟢 НОВАЯ ЗАЯВКА НА САЙТ','',`👤 Имя: ${escapeHtml(name)}`,`📞 Телефон: ${escapeHtml(phone)}`,`✈️ Telegram: ${escapeHtml(telegram||'не указан')}`,`🧩 Тип сайта: ${escapeHtml(type)}`,`💰 Бюджет: ${escapeHtml(budget)}`,'','📝 Описание:',escapeHtml(description),'',`🕒 ${order.createdAt}`].join('\n');
  try {
    const redis=new Redis({url:redisUrl,token:redisToken});
    await redis.lpush('ibrohim:orders',JSON.stringify(order));
    const tg=await fetch(`https://api.telegram.org/bot${token}/sendMessage`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({chat_id:chatId,text:message,parse_mode:'HTML',disable_web_page_preview:true})});
    const result=await tg.json();
    if(!tg.ok||!result.ok){console.error('Telegram error',result);return res.status(502).json({ok:false,message:'Заявка сохранена, но Telegram не принял сообщение.'});}
    return res.status(200).json({ok:true});
  } catch(e){console.error(e);return res.status(500).json({ok:false,message:'Ошибка сервера при сохранении заявки.'});}
}
