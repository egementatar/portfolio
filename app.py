from flask import Flask, render_template, request, jsonify
import requests
import os
from dotenv import load_dotenv

# .env yükle
load_dotenv()

app = Flask(__name__)

# Tokenları al
BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
CHAT_ID = os.getenv("TELEGRAM_CHAT_ID")

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/send-message', methods=['POST'])
def send_message():
    data = request.get_json()
    
    if not data or not data.get('name') or not data.get('email'):
        return jsonify({"success": False, "error": "Eksik bilgi."}), 400

    telegram_msg = f"📩 *Web Mesajı*\n\n👤 {data['name']}\n📧 {data['email']}\n📝 {data['message']}"
    
    url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"
    payload = {"chat_id": CHAT_ID, "text": telegram_msg, "parse_mode": "Markdown"}
    
    try:
        req = requests.post(url, json=payload)
        return jsonify({"success": True}) if req.status_code == 200 else jsonify({"success": False, "error": "Telegram Hatası"}), 500
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
