const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const aiService = require('./services/aiService');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// API Routes

// 1. Focus Mode - Session Analysis
app.post('/api/ai/focus-analysis', async (req, res) => {
    const insight = await aiService.analyzeSession(req.body);
    res.json(insight);
});

// 2. Dashboard - Academic Risk Insight
app.post('/api/ai/dashboard-insight', async (req, res) => {
    const insight = await aiService.analyzeRisk(req.body);
    res.json(insight);
});

// 3. Top Priorities - Task Reasoning
app.post('/api/ai/task-reasoning', async (req, res) => {
    const insight = await aiService.analyzeTaskPriority(req.body);
    res.json(insight);
});

// 4. Smart Schedule - Adaptive Rescheduling
app.post('/api/ai/schedule-adjustment', async (req, res) => {
    const insight = await aiService.analyzeReschedule(req.body);
    res.json(insight);
});

// 5. Attendance Risk Monitor
app.post('/api/ai/attendance-risk', async (req, res) => {
    const insight = await aiService.analyzeAttendance(req.body);
    res.json(insight);
});

// 6. Weekly Reflection
app.post('/api/ai/weekly-reflection', async (req, res) => {
    const insight = await aiService.analyzeReflection(req.body);
    res.json(insight);
});

// 7. Academic Health
app.post('/api/ai/academic-health', async (req, res) => {
    const insight = await aiService.analyzeAcademicHealth(req.body);
    res.json(insight);
});

// 8. Prioritize Tasks
app.post('/api/ai/prioritize-tasks', async (req, res) => {
    const result = await aiService.prioritizeTasks(req.body.tasks);
    res.json(result);
});

// 9. Health Check
app.get('/api/ai/health', async (req, res) => {
    const status = await aiService.checkHealth();
    res.json(status);
});

app.listen(PORT, () => {
    console.log(`AI Decision Engine running on port ${PORT}`);
});
