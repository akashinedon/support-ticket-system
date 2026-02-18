# Support Ticket System

A full-stack support ticket system with AI-powered ticket classification using Anthropic's Claude.

## Features
- **AI Classification**: Automatically suggests category and priority for new tickets.
- **Real-time Stats**: Dashboard showing ticket categories, priorities, and daily averages.
- **Robust Backend**: Built with Django and PostgreSQL.
- **Modern Frontend**: Interactive React interface.
- **Dockerized**: Easy setup with Docker Compose.

## Prerequisites
- Docker Desktop
- Anthropic API Key

## Quick Start

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd support-ticket-system
   ```

2. **Configure Environment**:
   Create a `.env` file in the root directory:
   ```env
   LLM_API_KEY=your_anthropic_api_key_here
   ```

3. **Launch the Application**:
   ```bash
   docker-compose up --build -d
   ```

4. **Access the App**:
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:8000/api](http://localhost:8000/api)

## Development
- **Backend**: Django REST Framework handles the API and ticket logic.
- **Frontend**: React handles the UI and interacts with the API.
- **Database**: PostgreSQL handles persistent data storage.
