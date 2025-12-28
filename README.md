# 📦 AcadBox — Smart Academic Management System

AcadBox is an intelligent academic dashboard designed to help students **track performance, manage attendance risk, plan schedules, and stay focused** — all from a single platform.

> 🚨 Most students don’t fail due to low grades — they fail due to **attendance shortages**.  
> **AcadBox predicts academic and attendance risks *before* they become irreversible.**

---

## 🚀 Key Features

### 🧠 AI-Powered Prioritization
- **Smart Task Sorting:** Uses a Random Forest model to prioritize tasks based on deadline, effort, and course credits.
- **Academic Health Engine:** Predicts your academic health status (Excellent, Strong, Critical) based on attendance, grades, and focus habits.
- **Intelligent Insights:** Provides actionable advice like "Focus on Data Structures today to save your streak."

### 📊 Academic Performance Tracking
- Cumulative CPI and semester-wise SPI
- Course-level grade management
- Clean academic overview dashboard
- Semester-based performance tracking

### ⚠️ Attendance Risk Monitor (Core Feature 🔥)
- Course-wise attendance percentage
- Safe / At-Risk / Critical classification
- Predictive insights such as:
  - *“If you miss the next 2 classes, attendance will drop to 68%”*
  - *“You can miss only 1 more class to stay above 80%”*
- Built around the **80% minimum attendance rule**

### 🗓 Smart Schedule
- **AI-Optimized Plan:** Automatically buckets tasks into "Today" and "Tomorrow" based on urgency.
- **Visual Feedback:** "AI Thinking" animations show when the system is processing your workload.
- **Full Control:** Edit, delete, and manage tasks directly from the schedule.

### 🎯 Focus Mode
- **Locked Sessions:** Commit to a task and lock the screen to prevent distractions.
- **AI Task Selection:** Selects the most critical task for you to work on first.
- **Session Autopsy:** Analyze your performance after each session.

---

## 🛠 Tech Stack

- **Frontend:** React + Vite (Modern, Responsive UI)
- **Backend:** Node.js + Express (API Gateway & Business Logic)
- **AI Service:** Python + Flask + Scikit-Learn (Machine Learning Models)
- **Data Persistence:** LocalStorage (Frontend) & In-Memory/JSON (Backend)

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js (v16+)
- Python (v3.8+)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd acadbox
```

### 2. Setup Frontend
```bash
npm install
npm run dev
```
*Runs on `http://localhost:5173`*

### 3. Setup Backend (Node.js)
```bash
cd server
npm install
node index.js
```
*Runs on `http://localhost:5000`*

### 4. Setup AI Service (Python)
```bash
cd python_service
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```
*Runs on `http://localhost:5001`*

---

## 🏃‍♂️ Running the Full App
For the application to work correctly, **all three services must be running simultaneously**.

1. **Terminal 1:** `npm run dev` (Frontend)
2. **Terminal 2:** `node server/index.js` (Backend)
3. **Terminal 3:** `python python_service/app.py` (AI Service)

---

## 🏆 Hackathon Note
AcadBox was built to address **real academic pain points**, especially attendance-related failures, using **predictive and user-friendly design**. It integrates a real Machine Learning model to provide personalized study recommendations.

---

## 📄 License
This project is open-source and available for educational use.
