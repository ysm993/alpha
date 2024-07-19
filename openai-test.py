<<<<<<< HEAD
import os
from flask import Flask, request, jsonify
import openai

app = Flask(__name__)

# Load OpenAI API key from .env file
openai.api_key = os.getenv("OPENAI_API_KEY")

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    response = openai.ChatCompletion.create(
        model="gpt-4.0-mini",
        messages=data['messages']
    )
    return jsonify(response['choices'][0]['message'])

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
    app.run(host='0.0.0.0', port=5000)
=======
import os
from flask import Flask, request, jsonify
import openai

app = Flask(__name__)

# Load OpenAI API key from .env file
openai.api_key = os.getenv("OPENAI_API_KEY")

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    response = openai.ChatCompletion.create(
        model="gpt-4.0-mini",
        messages=data['messages']
    )
    return jsonify(response['choices'][0]['message'])

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
    app.run(host='0.0.0.0', port=5000)
>>>>>>> 47c4e29 (Deploy Flask app to Heroku)
