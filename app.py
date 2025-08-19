import os
from flask import Flask, request, jsonify
import google.generativeai as genai

app = Flask(__name__)

# 設定 Gemini API 金鑰（從 Heroku 環境變數取得）
GOOGLE_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GOOGLE_API_KEY)

# 初始化 Gemini 模型（使用聊天模型）
model = genai.GenerativeModel('gemini-pro')

@app.route("/chat", methods=["POST"])
def chat():
    user_message = request.json.get("message", "")

    if not user_message:
        return jsonify({"reply": "請輸入訊息"}), 400

    try:
        response = model.generate_content(user_message)
        reply = response.text.strip()
        return jsonify({"reply": reply})

    except Exception as e:
        return jsonify({"reply": f"錯誤：{str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True)
