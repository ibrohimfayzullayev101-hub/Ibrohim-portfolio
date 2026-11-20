import {Redis} from '@upstash/redis';
import {isAdmin} from './_auth.js';
export default async function handler(req,res){
 if(req.method!=='GET')return res.status(405).end();if(!isAdmin(req))return res.status(401).json({message:'Unauthorized'});
 try{const r=new Redis({url:process.env.UPSTASH_REDIS_REST_URL,token:process.env.UPSTASH_REDIS_REST_TOKEN});const items=await r.lrange('ibrohim:orders',0,199);return res.status(200).json({orders:items.map(x=>typeof x==='string'?JSON.parse(x):x)});}catch(e){console.error(e);return res.status(500).json({message:'Не удалось загрузить заявки.'});}
}
