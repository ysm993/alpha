from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import os

openai.api_key = os.getenv("OPENAI_API_KEY")

app = Flask(__name__)
CORS(app)

@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.json
    messages = data["messages"]
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=messages
    )
    return jsonify(response.choices[0].message)

if __name__ == "__main__":
    app.run()
