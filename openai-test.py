from flask import Flask, request, jsonify
from flask_cors import CORS
import openai

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

openai.api_key = 'YOUR_API_KEY'

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json()
    if not data or 'message' not in data:
        return jsonify({"error": "No message provided"}), 400
    
    response = openai.ChatCompletion.create(
        model="gpt-4",  # 최고 성능의 모델 사용
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": data['message']}
        ]
    )
    return jsonify(response)

@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    return response

if __name__ == '__main__':
    app.run(debug=False, port=5000)
