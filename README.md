# SDE Assignment - Voice-Enabled Task Tracker

This project is a full-stack, voice-enabled task management application. It allows users to create, categorize, and manage tasks using natural language voice commands, which are parsed and processed by a generative AI model.

---

## 1. Project Setup

### 1a. Prerequisites

Ensure you have the following installed on your system:

| Prerequisite | Version | Notes |
| :--- | :--- | :--- |
| **Node.js** | v18+ (Recommended) | Used for both the MERN stack backend and React frontend. |
| **MongoDB** | N/A | A running instance (local or Atlas) is required. |
| **Google GenAI API Key** | N/A | Required for the AI functionality. |

### 1b. Installation Steps

Follow these steps for both the backend (root: `/backend`) and frontend (root: `/client`).

**1. Clone the repository**
```bash
git clone [https://github.com/Dhanush463/VoiceEnabledTaskCreation.git](https://github.com/Dhanush463/VoiceEnabledTaskCreation.git)
cd VoiceEnabledTaskCreation

## 2. Backend Setup
# Navigate to the backend directory
cd backend
# Install dependencies
npm install

## 3. Frontend Setup
# Navigate to the frontend directory
cd ../frontend
# Install dependencies
npm install

## 4. Run the project locally
# Frontend
npm start
# Backend
npm run dev

## 5. Tech Stack

Component -	Technology -	Key Libraries/Dependencies
Frontend - React 19	- axios, react-router-dom, @hello-pangea/dnd (Drag-and-Drop), react-speech-recognition.
Backend -	Node.js + Express.js (MERN) -	express, cors, dotenv, mongoose.
Database (DB) -	MongoDB -	mongoose (ODM).
AI -	Google GenAI (Gemini API) -	@google/genai
AI Utility -	Chrono-Node -	chrono-node (Natural language date parser).

## 6. API Documentation
#The backend API runs on port 5000 (e.g., http://localhost:5000/api/tasks
Method - Path	- Description
GET	- /api/tasks - Fetches all tasks.
POST - /api/tasks	- Creates a new task (text or voice-parsed).
PUT	- /api/tasks/:id	- Updates a task (e.g., status, content).
DELETE - /api/tasks/:id	- Deletes a task.

## 7.Decisions & Assumptions

### 7a. Key Design Decisions

* **MERN Stack:** Chosen for **rapid development** and the unified JavaScript environment across the stack.
* **AI for Task Parsing:** The core feature relies on the **Gemini API** for **NLP** to accurately extract task details (title, due date, status) from free-form voice input.
* **`chrono-node` Usage:** Used to reliably parse the due date from the AI's structured text output into a standardized **JavaScript `Date` object**.

### 7b. Assumptions

* **Environment Variables:** Assumed that required secrets are managed using the **`.env`** file.
* **Task Structure:** Assumed all generated tasks will fit a simple schema (title, due date, status).
* **Voice Input Quality:** Assumed the user provides reasonably clear voice input, with the AI handling the interpretation of the resulting speech-to-text.

---

## 8.  AI Tools Usage

### 8a. Which AI Tools You Used

* **Google Gemini (via GenAI SDK):** Used for the core **NLP task**.
* **GitHub Copilot:** Used during development.

### 8b. What They Helped With

* **Gemini (Core Task):** Primary use was **parsing ideas and structuring data**. Essential for converting unstructured user voice text into a reliable **JSON format**.
* **Copilot (Boilerplate/Debugging):** Primarily used for generating **boilerplate code** (Express router setup, Mongoose schema definitions) and assisting with **debugging** syntax errors.

### 8c. Any Notable Prompts/Approaches

* **Structured Output:** Leveraged the **Structured Output (JSON mode)** capability of the Gemini API to guarantee a predictable JSON object containing the `title`, `dueDate`, and `status`.
* **System Instruction:** A specific System Instruction was used to define the expected output format:
    > "You are a Task Parsing Bot. Analyze the user's request and extract the task title, a due date (if specified, otherwise null), and the status. Status must be 'todo', 'in-progress', or 'done'. Output ONLY a JSON object."

### 8d. What You Learned or Changed

* **Shift from Regex to AI:** Switching from complex Regular Expressions (RegEx) to the **Gemini API** significantly simplified the parsing logic and improved reliability for diverse natural language inputs.
* **Delegation of Date Parsing:** Learned that delegating date conversion from the extracted string (via AI) to a dedicated library like **`chrono-node`** (for standardizing the format) leads to a cleaner and more reliable data pipeline.

