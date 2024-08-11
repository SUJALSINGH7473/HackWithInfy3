from youtube_transcript_api import YouTubeTranscriptApi

from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes

@app.route('/')
def hello():
    return jsonify({"message": "Hello, World!"})

@app.route('/api/data', methods=['GET'])
def get_data():
    query = request.args.get('vId')
    
    ele=YouTubeTranscriptApi.get_transcript(query,languages=['en'])
    return jsonify(ele)

@app.route('/api/item', methods=['POST'])
def create_item():
    data = request.json
    # Process the data (e.g., save to database)
    return jsonify({"status": "Item created", "item": data}), 201
if __name__ == '__main__':
    app.run(debug=True)
# Remove the if __name__ == '__main__' block


