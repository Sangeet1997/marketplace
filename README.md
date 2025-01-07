# FairTrader AI

## Project Overview

FairTrader AI is an intelligent chatbot system designed for a marketplace where users can buy and sell cars while interacting with a conversational assistant named Dave. Dave guides users with navigation, predicts car prices, negotiates prices, and provides context-aware conversations using user purchase history.

## Demo
- Frontend demo: https://youtu.be/LPZE1T6YCU8
- Backend explained: https://youtu.be/XHBs2u6TyF4

## Technologies Used

### Frontend
- React.js with Tailwind CSS for responsive UI/UX

### Backend
- Node.js and Express.js for handling API requests
- Dedicated LLM integration server using LangChain

### Database
- MongoDB for managing user accounts, transaction history, and store inventory
- Vector database for embedding storage

### Authentication
- JWT for secure login and session management

### AI Technologies
- LLM: Llama 3.2 via Ollama and LangChain
- Embedding: mxbai-embed-large

## Core Components

### 1. Prompt Engineering
- Systematic prompting strategies for car price prediction and negotiation
- Contextual conversation flow design
- Defensive mechanisms for edge case handling
- Specialized conversation paths

### 2. Fine-Tuning
- Domain-specific dataset curation and standardization
- Market trend data augmentation
- Hugging Face fine-tuning tools
- Performance improvement of 25% in contextual understanding

### 3. Retrieval-Augmented Generation (RAG)
- Comprehensive knowledge base integration
- Embedding generation using mxbai-embed-large
- Efficient similarity-based information retrieval
- Intelligent document chunking

## Performance Metrics

- **Response Time**: 1.2 seconds average for RAG queries
- **Accuracy**: 
  - 93% car price prediction
  - High conversational context relevance
- **Error Handling**: 5% fallback rate

## Project Setup

### Prerequisites
- Ollama
- Node.js
- Python

### Installation Steps

1. **Install Ollama Models**
   ```bash
   ollama pull llama3.2
   ollama pull mxbai-embed-large
   ```

2. **Start Ollama Server**
   ```bash
   ollama serve
   ```

3. **Backend Server**
   ```bash
   cd backend
   node app.js
   ```

4. **LLM Handler**
   ```bash
   cd llm-handler
   py csvRead.py
   
   # Start vector embedding
   node vectorStore.js
   node index.js
   ```

5. **Frontend**
   ```bash
   cd frontend
   npm start
   ```

## Port Configuration

- **Backend Server**: 3000
- **LLM Handler**: 5000
- **Frontend (React)**: 3001

## Challenges and Solutions

| Challenge | Solution |
|-----------|----------|
| High RAG Latency | Optimized embedding storage and retrieval |
| Dataset Inconsistencies | Created Python standardization script |
| Multi-Server Integration | Established robust API endpoints |

## Future Improvements
- Enhance machine learning models
- Expand conversational capabilities
- Improve real-time market trend integration
- Car search and recommendation from chatbot
