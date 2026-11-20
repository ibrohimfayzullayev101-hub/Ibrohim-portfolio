import crypto from 'node:crypto';
import {signature,sessionCookie} from './_auth.js';
export default function handler(req,res){
 if(req.method!=='POST')return res.status(405).json({message:'Method not allowed'});
 const pass=process.env.ADMIN_PASSWORD,secret=process.env.SESSION_SECRET;
 if(!pass||!secret||secret.length<32)return res.status(500).json({message:'В Vercel настройте ADMIN_PASSWORD и SESSION_SECRET (не менее 32 символов).'});
 const input=Buffer.from(String(req.body?.password||'')),expected=Buffer.from(pass);
 if(input.length!==expected.length||!crypto.timingSafeEqual(input,expected))return res.status(401).json({message:'Неверный пароль.'});
 const exp=String(Date.now()+8*60*60*1000);res.setHeader('Set-Cookie',sessionCookie(exp+'.'+signature(exp),8*60*60));return res.status(200).json({ok:true});
}
