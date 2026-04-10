<div align="center">

# AcadBox

### Smart Academic Management System.

<br>

[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Scikit-Learn](https://img.shields.io/badge/scikit--learn-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)

<br>

AcadBox is an intelligent academic dashboard designed to help students **track performance, manage attendance risk, plan schedules, and stay focused** — all from a single platform.

<br>

> **Note:** Most academic failures stem from attendance shortages. AcadBox predicts academic and attendance risks prior to irreversible consequences.

---

</div>

<br>

## Key Features

<table>
<tr>
<td width="50%">

### AI-Powered Prioritization
- **Smart Task Sorting**: Implements Random Forest models prioritizing task matrices based on impending deadlines, required effort, and course credits.
- **Academic Health Engine**: Predicts overall academic health status (Excellent, Strong, Critical) by analyzing attendance maps, derived grades, and focusing habits.
- **Intelligent Insights**: Yields actionable, continuous operational advice (e.g., "Shift focus to Data Structures today to maintain the active streak").

</td>
<td width="50%">

### Attendance Risk Monitor
- **Course-Wise Tracking**: Validates active attendance percentages consistently.
- **Threshold Classification**: Maps continuous safe, at-risk, and critical bounds metrics.
- **Predictive Interpolation**: Yields insights highlighting threshold breaking points (e.g., remaining misses available prior to dropping below the 80% mark).

</td>
</tr>
<tr>
<td width="50%">

### Academic Performance
- Accumulates core CPI evaluations and semester-wise SPI performance.
- Direct course-level grade management architecture.
- Centralized comprehensive academic overview dashboard.

</td>
<td width="50%">

### Intelligent Focus Control
- **AI Task Selection**: Automatically queues primary critical tasks derived computationally.
- **Locked Target Sessions**: Distraction-free focal operations.
- **Session Autopsy**: Yields post-session analytical breakdowns covering time tracking metrics.

</td>
</tr>
</table>

<br>

## Tech Stack

| Layer | Architecture |
|---|---|
| **Frontend** | React + Vite (Modern Responsive User Interface) |
| **Backend** | Node.js + Express (Operational API Gateway) |
| **AI Service** | Python + Flask + Scikit-Learn (Predictive Machine Learning Modeling) |
| **Data Persistence** | LocalStorage (Client Memory) combined with In-Memory JSON (Runtime Node.js Server) |

<br>

## Setup & Installation

### Prerequisites
- Node.js (v16+)
- Python (v3.8+)

### 1. Repository Configuration
```bash
git clone https://github.com/punitxdev/AcadBox.git
cd AcadBox
```

### 2. Frontend Initialization
```bash
npm install
npm run dev
```
> Operates locally via `http://localhost:5173`

### 3. Backend Generation
```bash
cd server
npm install
node index.js
```
> API processes execute on `http://localhost:5000`

### 4. AI Service Mapping
```bash
cd python_service
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 5. Generate Essential AI Models
The pre-trained classification models necessitate localized programmatic generation sequences before activating the application stack.

1. Navigate toward the `aiModels/` system directory.
2. Initialize and evaluate all integrated cells spanning `TaskPriorityModel.ipynb` yielding `acadbox_task_priority_model.pkl`.
3. Evaluate execution mapping spanning `AcademicHealthModel.ipynb` resulting in `acadbox_academic_health_model.pkl`.
4. Validate both generated `.pkl` binary objects exist securely within the `aiModels/` root block.

### 6. Execute Python Target
```bash
python app.py
```
> Evaluates target logic locally on `http://localhost:5001`

<br>

## System Execution

For the centralized structure to execute effectively, **all integrated services must run simultaneously**.

1. **Terminal 1**: `npm run dev` (Client Application)
2. **Terminal 2**: `node server/index.js` (Server Routing)
3. **Terminal 3**: `python python_service/app.py` (AI Analysis)

<br>

## Project Details

AcadBox solves foundational university metrics surrounding critical failure paths, heavily targeting attendance deviations leveraging systematic machine learning predictive structures generating highly tailored behavioral and study optimizations.

<br>

## Contribution and Licensing

Available generally for overarching educational deployment and structural utilization. Contributions addressing algorithmic iteration processing are appreciated.

<br>