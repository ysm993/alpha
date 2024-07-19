from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

openai.api_key = os.getenv("OPENAI_API_KEY")

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    response = openai.Completion.create(
        engine="text-davinci-003",
        prompt=data['messages'],
        max_tokens=150
    )
    return jsonify({'response': response.choices[0].text.strip()})

@app.route('/api/generate-image', methods=['POST'])
def generate_image():
    data = request.json
    response = openai.Image.create(
        prompt=data['prompt'],
        n=1,
        size="1024x1024"
    )
    return jsonify({'image_url': response['data'][0]['url']})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"Server is running on port {port}")
    app.run(host='0.0.0.0', port=port)
