from flask import Flask, request, jsonify
from flask_cors import CORS
import openai

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

openai.api_key = 'YOUR_OPENAI_API_KEY'

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json()
    messages = data.get("messages")
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=messages
    )
    return jsonify(response['choices'][0]['message'])

@app.route('/api/generate-image', methods=['POST'])
def generate_image():
    data = request.get_json()
    prompt = data.get("prompt")
    response = openai.Image.create(
        prompt=prompt,
        n=1,
        size="1024x1024"
    )
    return jsonify({'image_url': response['data'][0]['url']})

@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    return response

if __name__ == "__main__":
    app.run()
