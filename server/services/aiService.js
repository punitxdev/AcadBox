// Using built-in fetch
// Using fetch for modern node or axios if preferred. Let's use fetch as it is built-in in newer node, 
// but to be safe with older node environments without adding dependencies, I'll use standard http or just assume fetch is available (Node 18+).
// Actually, let's use 'axios' if available or standard 'http'. 
// Given the user wants to remove dependencies, I'll use built-in 'fetch' if possible, or 'http'.
// However, to keep it simple and robust, I will use `fetch` which is available in Node 18+ (User has Node environment).
// If fetch is not available, I'll use a helper. But wait, I should check if I can add axios or just use fetch.
// The user said "remove OpenAI dependencies", not "remove ALL dependencies".
// I will assume `fetch` is available (Node 18+ is standard now).

const PYTHON_SERVICE_URL = 'http://localhost:5001/predict';

const aiService = {
    // 1. Focus Mode - Session Analysis
    analyzeSession: async (data) => {
        // Simple heuristic: if focus time > 30 mins, it's good.
        const duration = parseFloat(data.focusDuration || 0);
        let insight = "Good effort, keep it up.";
        if (duration > 45) insight = "Excellent deep work session.";
        else if (duration < 15) insight = "Short session, try to block out more time next time.";

        return { insight };
    },

    // 2. Dashboard - Academic Risk Insight
    analyzeRisk: async (data) => {
        // Heuristic based on streak and deadlines
        const streak = data.streak || 0;
        const pending = data.pendingDeadlines || 0;

        let insight = "Maintain your consistency.";
        if (streak === 0 && pending > 2) insight = "Risk: High. You have broken your streak and have pending deadlines.";
        else if (streak > 3) insight = "Momentum is good. Keep the streak alive.";

        return { insight };
    },

    // 3. Top Priorities - Task Reasoning (CALLS PYTHON SERVICE)
    analyzeTaskPriority: async (data) => {
        try {
            // Map input data to Python service expected format
            // Expected: days_left, task_type, effort_hours, course_credit, attendance_risk, consistency, overdue_count
            const payload = {
                days_left: data.daysLeft || 0,
                task_type: data.taskType || 1, // Default to Assignment
                effort_hours: data.effortHours || 1,
                course_credit: data.courseCredit || 1,
                attendance_risk: data.attendanceRisk || 0,
                consistency: data.consistency || 0.5,
                overdue_count: data.overdueCount || 0
            };

            const response = await fetch(PYTHON_SERVICE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`Python service error: ${response.statusText}`);
            }

            const result = await response.json();
            return {
                insight: `Priority: ${result.priority_label} (Source: ${result.source}).`
            };

        } catch (error) {
            console.error("AI Service Error:", error);
            return { insight: "Could not calculate priority. Defaulting to normal." };
        }
    },

    // 4. Smart Schedule - Adaptive Rescheduling
    analyzeReschedule: async (data) => {
        return { insight: "Rescheduling suggested to balance workload." };
    },

    // 5. Attendance Risk Monitor
    analyzeAttendance: async (data) => {
        const attendance = data.attendance || 100;
        let insight = "Attendance is safe.";
        if (attendance < 75) insight = "CRITICAL: Attendance is below 75%. Attend next classes.";
        else if (attendance < 85) insight = "WARNING: Attendance is dropping. Be careful.";

        return { insight };
    },

    // 6. Weekly Reflection
    analyzeReflection: async (data) => {
        return { insight: "Review your week and plan ahead for better outcomes." };
    },

    // 7. Academic Health (CALLS PYTHON SERVICE)
    analyzeAcademicHealth: async (data) => {
        try {
            console.log("\n[Node.js] Received Academic Health Request:", JSON.stringify(data, null, 2));
            const PYTHON_HEALTH_URL = 'http://localhost:5001/predict-health';

            // Map input data to Python service expected format
            const payload = {
                task_completion_rate: data.taskCompletionRate || 0.5,
                attendance_percent: data.attendancePercent || 80,
                average_grade: data.averageGrade || 7.0,
                focus_hours_week: data.focusHoursWeek || 5,
                streak_consistency: data.streakConsistency || 0.5,
                overdue_ratio: data.overdueRatio || 0
            };
            console.log("[Node.js] Forwarding to Python:", JSON.stringify(payload, null, 2));

            const response = await fetch(PYTHON_HEALTH_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`Python service error: ${response.statusText}`);
            }

            const result = await response.json();
            console.log("[Node.js] Received from Python:", JSON.stringify(result, null, 2));

            return {
                insight: result // Return the full object { academic_health_score, health_status }
            };

        } catch (error) {
            console.error("AI Service Error:", error);
            return { insight: { academic_health_score: 0, health_status: "Error" } };
        }
    },

    // 8. Prioritize Tasks (Batch Prediction + Sorting)
    prioritizeTasks: async (tasks) => {
        try {
            console.log(`\n[Node.js] Prioritizing ${tasks.length} tasks...`);
            const PYTHON_BATCH_URL = 'http://localhost:5001/predict-batch';

            // Map tasks to features
            const features = tasks.map(t => ({
                days_left: t.days_left,
                task_type: t.task_type,
                effort_hours: t.effort_hours,
                course_credit: t.course_credit,
                attendance_risk: t.attendance_risk,
                consistency: t.consistency,
                overdue_count: t.overdue_count
            }));

            const response = await fetch(PYTHON_BATCH_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tasks: features })
            });

            if (!response.ok) throw new Error("Python batch prediction failed");

            const result = await response.json();
            const predictions = result.predictions;

            // Merge predictions with original tasks
            const prioritizedTasks = tasks.map((task, index) => ({
                ...task,
                ai_priority_code: predictions[index].priority_code,
                ai_priority_label: predictions[index].priority_label
            }));

            // Sort: Priority (High to Low) -> Credit (High to Low)
            prioritizedTasks.sort((a, b) => {
                if (b.ai_priority_code !== a.ai_priority_code) {
                    return b.ai_priority_code - a.ai_priority_code; // Higher priority first
                }
                return b.course_credit - a.course_credit; // Higher credit first
            });

            console.log("[Node.js] Tasks prioritized and sorted.");
            return { insight: { sortedTasks: prioritizedTasks } };

        } catch (error) {
            console.error("AI Service Error:", error);
            return { insight: { sortedTasks: tasks } }; // Fallback to original order
        }
    }
};

module.exports = aiService;
