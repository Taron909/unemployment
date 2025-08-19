@echo off
REM 啟動 Python HTTP Server
start python -m http.server 8000

REM 等待 1 秒讓伺服器啟動
timeout /t 1 > nul

REM 自動開啟瀏覽器到首頁（假設 index.html）
start http://localhost:8000/index.html
