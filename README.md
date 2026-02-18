# Support Ticket System

A full-stack, AI-powered support ticket management platform. This system automatically classifies incoming tickets by category and priority using large language models, providing a streamlined workflow for support teams.

## 🚀 Quick Start

### Prerequisites
- **Docker Desktop**: Ensure Docker is installed and running.
- **Anthropic API Key**: Required for AI-powered ticket classification.

### Installation & Setup
1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd support-ticket-system
   ```

2. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   LLM_API_KEY=your_anthropic_api_key_here
   ```

3. **Run with Docker**:
   ```bash
   docker-compose up --build -d
   ```

4. **Access the Application**:
   - **Frontend**: [http://localhost:3000](http://localhost:3000)
   - **Backend API**: [http://localhost:8000/api](http://localhost:8000/api)

---

## 🤖 LLM Choice: Claude 3.5 Haiku

For this project, I chose **Anthropic's Claude 3.5 Haiku** (via the `anthropic` Python SDK).

**Why Claude 3.5 Haiku?**
- **Speed**: It offers extremely low latency, ensuring that ticket classification feels instantaneous to the user.
- **Cost-Efficiency**: It is highly cost-effective for high-volume automated tasks like classification.
- **Structured Output**: It is remarkably reliable at following system instructions and returning clean, parseable JSON, which is critical for our backend integration.
- **Accuracy**: Despite being a "smaller" model, it excels at categorization and sentiment/priority analysis.

---

## 🏗️ Design Decisions

### 1. Containerization (Docker)
The entire stack is containerized using Docker and Docker Compose. This ensures that the application, database, and all dependencies run identically on any machine, eliminating "it works on my machine" issues.

### 2. Service Isolation & Networking
- **Backend (Django)**: Chosen for its robust ORM, built-in security features, and excellent integration with REST frameworks.
- **Database (PostgreSQL)**: A reliable, industry-standard relational database.
- **Frontend (React)**: Enables a dynamic, single-page application experience with real-time updates.
Docker networking allows the backend to communicate with the database securely via an internal service name (`db`).

### 3. AI-First Workflow
Instead of forcing users to manually categorize every ticket, the system uses a **debounced LLM call**. This provides "suggested" fields as the user types, improving data consistency and reducing user friction.

### 4. Database-Level Optimization
The Statistics Dashboard utilizes Django's aggregation and annotation features to perform heavy calculations (like daily averages and category breakdowns) directly in PostgreSQL. This is significantly faster than pulling all records into Python for processing.

### 5. Security & Sensitive History
Strict `.gitignore` and `.dockerignore` policies are in place to prevent sensitive information (like API keys) from ever reaching version control. The git history has been optimized to remove accidental inclusions of such data.

---

## 🛠️ Development & Commits
This project follows a clean commit history. You can review the `.git` log to see the evolution of the project, from initial setup to AI integration and final optimization.
