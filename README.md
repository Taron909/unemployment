# 數據之下的現實：重新認識台灣失業率

一套可直接部署到 **GitHub Pages（前端）** 與 **Netlify（Functions）** 的專案範本。

## 兩種部署方式

### A) GitHub Pages（純靜態）
1. 將此專案推到 GitHub。
2. 倉庫 → Settings → Pages：
   - Source: Deploy from a branch
   - Branch: `main`，資料夾 `/(root)` 或 `/public`
3. 首次建置完成後，會有 Pages 網址。

> 若要在 Pages 使用聊天功能，請先將 Functions 部署到 Netlify，
> 然後在 `public/config.js` 的 `FALLBACK_FUNCTION_BASE` 填入你的 Netlify 網域：
> `https://<your-site>.netlify.app`。前端會自動偵測並改用此位址。

### B) Netlify（推薦，一鍵包含 Functions）
1. 進 Netlify → Add new site → Import from Git → 選你的 repo。
2. Build command: `npm run build`
3. Publish directory: `public`
4. Functions directory: `netlify/functions`
5. 在 Netlify 環境變數加入 `GEMINI_API_KEY`。
6. 完成後網站位於 `https://<your-site>.netlify.app`。`/.netlify/functions/chat` 可直接使用。

## 本地開發
```bash
npm install
npm run dev
# 會啟動 Netlify 本地伺服器，前端在 http://localhost:8888
```

## 結構
```
public/                  # 靜態站點
netlify/functions/       # Serverless Functions（Node.js）
.github/workflows/       # GitHub Pages 自動部署工作流
```

## 安全
- **不要**把 API 金鑰直接寫進前端。
- 將金鑰設定在 Netlify 環境變數 `GEMINI_API_KEY`。

## 授權
MIT
