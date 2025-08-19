// netlify/functions/generate.js
// 伺服器端代理，把前端請求轉打 Google API，金鑰用 Netlify 環境變數保存

const ALLOWED_ORIGINS = (process.env.CORS_ORIGINS || 'http://localhost:8888').split(',');

const cors = (origin) => ({
  'Access-Control-Allow-Origin': origin,
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json; charset=utf-8'
});

exports.handler = async (event) => {
  const originHeader = event.headers.origin || event.headers.Origin || '';
  const origin = ALLOWED_ORIGINS.includes(originHeader) ? originHeader : ALLOWED_ORIGINS[0];

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: cors(origin) };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: cors(origin), body: '{"error":"Method Not Allowed"}' };
  }

  const API_KEY = process.env.GOOGLE_API_KEY; // ← 在 Netlify 後台設定
  if (!API_KEY) {
    return { statusCode: 500, headers: cors(origin), body: '{"error":"Missing GOOGLE_API_KEY"}' };
  }

  const MODEL = 'gemini-2.5-flash-preview-05-20';
  const body = JSON.parse(event.body || '{}');

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const text = await resp.text();
    return { statusCode: resp.status, headers: cors(origin), body: text };
  } catch (err) {
    return {
      statusCode: 502,
      headers: cors(origin),
      body: JSON.stringify({ error: 'Upstream fetch failed', detail: String(err) })
    };
  }
};
