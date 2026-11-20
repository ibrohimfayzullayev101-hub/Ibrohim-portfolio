import crypto from 'node:crypto';
export function signature(value){return crypto.createHmac('sha256',process.env.SESSION_SECRET||'').update(value).digest('hex')}
export function isAdmin(req){
 const cookie=(req.headers.cookie||'').split(';').map(x=>x.trim()).find(x=>x.startsWith('ibrohim_admin='));
 if(!cookie)return false; const token=cookie.slice('ibrohim_admin='.length); const [expiry,sig]=token.split('.');
 if(!expiry||!sig||Number(expiry)<Date.now())return false; const expected=signature(expiry);
 const a=Buffer.from(sig),b=Buffer.from(expected); return a.length===b.length&&crypto.timingSafeEqual(a,b);
}
export function sessionCookie(value,maxAge){return `ibrohim_admin=${value}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${maxAge}`}
