# FreelanceHub RAG Chatbot

A Retrieval-Augmented Generation (RAG) chatbot specifically designed to answer questions about FreelanceHub. This chatbot uses LangChain, Ollama, and FAISS to provide accurate information about the FreelanceHub platform.

## Features

- **Domain-Specific Knowledge**: Only answers questions related to FreelanceHub
- **RAG Architecture**: Uses vector search to retrieve relevant information before generating answers
- **Web Interface**: Simple Flask web app for interacting with the chatbot
- **Conversation History**: Maintains context across multiple interactions

## Prerequisites

- Python 3.8+
- [Ollama](https://ollama.ai/) installed locally with the llama3 model
  - Run `ollama pull llama3` to download the model

## Setup

1. Clone this repository:
```bash
git clone https://github.com/yourusername/freelancehub-rag-chatbot.git
cd freelancehub-rag-chatbot
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
# On Windows
venv\Scripts\activate
# On macOS/Linux
source venv/bin/activate
```

3. Install the dependencies:
```bash
pip install -r requirements.txt
```

4. Ensure Ollama is running:
```bash
ollama serve
```

## Running the Chatbot

1. Start the Flask server:
```bash
python chatbot_server.py
```

2. Open your browser and navigate to:
```
http://localhost:5000
```

3. Start asking questions about FreelanceHub!

## Environment Variables

You can customize the chatbot using these environment variables:

- `OLLAMA_MODEL`: The Ollama model to use (default: "llama3")
- `OLLAMA_URL`: The URL of the Ollama API (default: "http://localhost:11434")
- `PORT`: The port on which to run the Flask server (default: 5000)

Example:
```bash
export OLLAMA_MODEL=mistral
export OLLAMA_URL=http://localhost:11434
export PORT=8080
python chatbot_server.py
```

## Customizing Knowledge

The chatbot's knowledge is stored in `backend/website_knowledge.json`. You can modify this file to update or extend the information about FreelanceHub.

## API Endpoints

- `POST /api/chat`: Send a message to the chatbot
  - Request body: `{"message": "your question", "user_id": "optional_user_id"}`
  - Response: `{"status": "success", "response": "chatbot's answer"}`

- `GET /api/status`: Check if the chatbot is online
  - Response: `{"status": "online|offline", "model": "model_name"}`

- `GET /api/history/<user_id>`: Get conversation history for a user
  - Response: `{"status": "success", "history": [{"question": "...", "answer": "...", "timestamp": "..."}]}`

## How it Works

1. The chatbot uses a JSON file (`website_knowledge.json`) as its knowledge base about FreelanceHub
2. When a question is received, it:
   - Checks if the question is relevant to FreelanceHub
   - Retrieves the most relevant information from the knowledge base using FAISS vector search
   - Sends the question and relevant context to Ollama for generating an answer
   - Returns only FreelanceHub-specific information

## Limitations

- The chatbot only knows about FreelanceHub based on the information in `website_knowledge.json`
- It requires Ollama to be running locally
- The current implementation doesn't support authentication 