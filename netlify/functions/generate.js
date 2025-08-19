// netlify/functions/generate.js
export async function handler(event) {
  // CORS 白名單（也可用 Netlify 環境變數 CORS_ORIGINS）
  const allowed = (process.env.CORS_ORIGINS || '').split(',').map(s=>s.trim()).filter(Boolean);
  const origin  = allowed.includes(event.headers.origin) ? event.headers.origin : (allowed[0] || '*');

  const cors = {
    'Access-Control-Allow-Origin':  origin,
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json; charset=utf-8',
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: cors }; // Preflight
  if (event.httpMethod !== 'POST')   return { statusCode: 405, headers: cors, body: '{"error":"Method Not Allowed"}' };

  const API_KEY = process.env.GOOGLE_API_KEY; // 在 Netlify 後台設定
  const MODEL   = 'gemini-2.5-flash-preview-05-20';
  const url     = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

  try {
    const resp = await fetch(url, { method:'POST', headers:{'Content-Type':'application/json'}, body: event.body });
    const text = await resp.text();
    return { statusCode: resp.status, headers: cors, body: text };
  } catch (err) {
    return { statusCode: 500, headers: cors, body: JSON.stringify({ error: String(err) }) };
  }
}
