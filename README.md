# GigPilot AI

GigPilot AI is a local-first assistant designed to help freelancers turn client briefs into structured project plans. It uses a React frontend, a FastAPI backend, and local language models through Ollama.

## What it does

- Helps organize client requirements into project plans.
- Provides a workspace for generating and reviewing results.
- Includes quick-start examples for common freelance projects.
- Connects to locally running AI models for generation.
- Uses a dark interface designed for a focused workflow.

## Tech stack

- **Frontend:** React, Vite, JavaScript, CSS
- **Backend:** Python, FastAPI
- **Local AI:** Ollama
- **Supported models:** Qwen 2.5 1.5B and Gemma 3 1B

## Requirements

Before running the project, install:

- Python 3.10 or newer
- Node.js and npm
- [Ollama](https://ollama.com/)

## Getting started

### 1. Clone the repository

```bash
git clone https://github.com/uditsharma45/gigpilot-ai.git
cd gigpilot-ai
```

### 2. Download a local model

Start Ollama and run:

```bash
ollama pull qwen2.5:1.5b
```

The backend must be configured to use the model you choose.

### 3. Start the backend

Open a terminal in the project folder:

```bash
cd backend
python -m pip install fastapi uvicorn requests
python -m uvicorn main:app --reload
```

The API should run at `http://127.0.0.1:8000`.

API documentation is available at `http://127.0.0.1:8000/docs`.

### 4. Start the frontend

Open a second terminal in the project folder:

```bash
cd frontend
npm install
npm run dev
```

Open the local address printed by Vite, usually `http://localhost:5173`.

## API endpoints

- `GET /` — API information
- `GET /health` — Backend and local model status
- `POST /api/generate` — Generate a project plan

## Privacy

GigPilot AI is designed to use local language models, helping keep client briefs on your machine when generation is handled entirely locally. Verify your local configuration before entering sensitive client information.

## Project status

GigPilot AI is a work in progress. Generated results may need review, and AI response validation and output quality still require testing.

## License

No license has been added yet.
