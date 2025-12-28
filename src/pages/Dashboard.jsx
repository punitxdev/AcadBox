import React, { useState, useEffect } from 'react';
import { useAcademic } from '../context/AcademicContext';
import TaskInput from '../components/TaskInput';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaLightbulb, FaHistory, FaFire } from 'react-icons/fa';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import './Dashboard.css';

ChartJS.register(ArcElement, Tooltip, Legend);

// StreakWidget component is no longer used as its content is integrated into the Dashboard header.
// Keeping it here for reference if needed, but it will be removed from the render flow.
const StreakWidget = ({ streak }) => {
    const isCracked = streak.status === 'cracked';

    return (
        <div className={`card streak-card ${isCracked ? 'cracked' : ''}`}>
            <div className="streak-header">
                <div className="streak-icon-wrapper">
                    <FaFire className={`streak-icon ${isCracked ? 'cracked-icon' : ''} icon-small`} />
                </div>
                <div className="streak-info">
                    <h3>{streak.current} Day Streak</h3>
                    <p>{isCracked ? "Momentum broken. Resume today to prevent decay." : "Consistency is key. Keep it up."}</p>
                </div>
            </div>
            {isCracked && <div className="crack-overlay"></div>}
        </div>
    );
};

const Dashboard = () => {
    const {
        getAcademicHealthBreakdown,
        getWeeklyReflection,
        tasks,
        streak,
        fetchAIInsight,
        courses, // Keep courses for getCourseName
        completeTask, // Keep completeTask for task completion
        getPriorityExplanation, // Keep getPriorityExplanation for priority tasks
        aiPrioritizedTasks,
        isAiLoading
    } = useAcademic();

    const health = getAcademicHealthBreakdown();
    const reflection = getWeeklyReflection();
    const [dashboardInsight, setDashboardInsight] = useState("Analyzing academic momentum...");
    const [aiHealth, setAiHealth] = useState(null);

    const [sortedTasks, setSortedTasks] = useState([]); // Kept for compatibility if needed, but we'll use aiPrioritizedTasks
    // const [isThinking, setIsThinking] = useState(true); // Removed local state

    useEffect(() => {
        const getInsight = async () => {
            // Dashboard Insight
            const insight = await fetchAIInsight('dashboard-insight', {
                streak: streak.current,
                weeklyFocusHours: reflection.focusHours,
                pendingDeadlines: tasks.filter(t => t.status === 'pending').length
            });
            if (insight) setDashboardInsight(insight);

            // Academic Health AI
            const healthData = await fetchAIInsight('academic-health', {
                taskCompletionRate: health.taskCompletion / 100,
                attendancePercent: health.attendancePerformance,
                averageGrade: (health.gradePerformance / 100) * 10, // Approx mapping
                focusHoursWeek: parseFloat(reflection.focusHours),
                streakConsistency: streak.status === 'solid' ? 1.0 : 0.5, // Simple mapping
                overdueRatio: 0.1 // Mock for now or calculate
            });

            if (healthData && healthData.academic_health_score !== undefined) {
                setAiHealth(healthData);
            }

            // Prioritize Tasks logic removed - using centralized context
        };
        getInsight();
    }, [streak.current, reflection.focusHours, tasks, fetchAIInsight]);

    const pendingTasks = tasks.filter(t => t.status === 'pending');
    const completedTasks = tasks.filter(t => t.status === 'completed');

    // Use AI Score if available, else fallback to local calculation
    const localHealthScore = Math.round(
        (health.taskCompletion * 0.3) +
        (health.focusConsistency * 0.2) +
        (health.gradePerformance * 0.2) +
        (health.attendancePerformance * 0.3)
    );

    const displayHealthScore = aiHealth ? aiHealth.academic_health_score : localHealthScore;
    const displayHealthStatus = aiHealth ? aiHealth.health_status : (localHealthScore > 80 ? "Excellent" : "Needs Attention");

    const chartData = {
        labels: ['Completed', 'Pending'],
        datasets: [
            {
                data: [completedTasks.length, pendingTasks.length],
                backgroundColor: ['#10b981', '#3b82f6'],
                borderWidth: 0,
            },
        ],
    };

    const getCourseName = (id) => courses.find(c => c.id === id)?.name || 'Unknown';

    console.log('Dashboard render');
    return (
        <div className="dashboard">
            {/* Debug placeholder */}
            <div style={{ padding: '1rem', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>Dashboard Loaded</div>
            <header className="page-header">
                <h1>Academic Dashboard</h1>
                <p className="date-display">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                <div className="ai-dashboard-insight">
                    <span className="ai-label">AI INSIGHT</span>
                    {dashboardInsight}
                </div>
            </header>

            <div className="dashboard-grid">
                {/* Streak Widget */}
                <StreakWidget streak={streak} />

                {/* Health Card */}
                <div className="card health-card">
                    <div className="card-header-with-info">
                        <h3>Academic Health (AI)</h3>
                        <div className="health-breakdown-tooltip">
                            <FaInfoCircle className="info-icon icon-small" />
                            <div className="tooltip-content">
                                <div className="tooltip-item">
                                    <span>Task Completion</span>
                                    <span>{health.taskCompletion}%</span>
                                </div>
                                <div className="tooltip-item">
                                    <span>Focus Consistency</span>
                                    <span>{health.focusConsistency}%</span>
                                </div>
                                <div className="tooltip-item">
                                    <span>Grade Performance</span>
                                    <span>{health.gradePerformance}%</span>
                                </div>
                                <div className="tooltip-item">
                                    <span>Attendance</span>
                                    <span>{health.attendancePerformance}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="chart-container">
                        <div className="health-score">
                            <span>{displayHealthScore}%</span>
                        </div>
                        <Doughnut data={chartData} options={{ cutout: '70%', plugins: { legend: { display: false } } }} />
                    </div>
                    <p className="health-status">
                        {displayHealthStatus}
                    </p>
                </div>

                {/* Priority Tasks */}
                <div className="card priority-card">
                    <h3>Top Priorities (AI Sorted)</h3>
                    <div className="task-list">
                        {isAiLoading ? (
                            <div className="ai-thinking-mini" style={{ padding: '20px', textAlign: 'center' }}>
                                <div className="ai-pulse-ring" style={{ width: '40px', height: '40px', margin: '0 auto 10px' }}></div>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>AI is prioritizing...</p>
                            </div>
                        ) : (
                            <>
                                {aiPrioritizedTasks.slice(0, 3).map(task => (
                                    <div key={task.id} className="task-item">
                                        <div className="task-info">
                                            <div className="task-header">
                                                <span className="task-course" style={{ color: courses.find(c => c.id === task.courseId)?.color }}>
                                                    {getCourseName(task.courseId)}
                                                </span>
                                                <div className="ai-explanation-tooltip">
                                                    <FaInfoCircle className="info-icon-small icon-small" />
                                                    <div className="tooltip-content-wide">
                                                        {getPriorityExplanation(task.id)}
                                                        <br />
                                                        <small>AI Priority: {task.ai_priority_label || 'Calculating...'}</small>
                                                    </div>
                                                </div>
                                            </div>
                                            <h4>{task.title}</h4>
                                            <span className="task-meta">Due: {task.deadline} • Effort: {task.effort}h</span>
                                        </div>
                                        <button className="btn-check" onClick={() => completeTask(task.id)}>
                                            <FaCheckCircle className="icon-small" />
                                        </button>
                                    </div>
                                ))}
                                {aiPrioritizedTasks.length === 0 && pendingTasks.length === 0 && <p className="empty-state">No pending tasks. Great job!</p>}
                            </>
                        )}
                    </div>
                </div>

                {/* Weekly Reflection Card */}
                <div className="card reflection-card">
                    <div className="card-header">
                        <FaHistory className="header-icon icon-small" />
                        <h3>Weekly Reflection</h3>
                    </div>
                    <div className="reflection-content">
                        <div className="reflection-stats">
                            <div className="stat-item">
                                <span className="stat-value">{reflection.tasksCompleted}</span>
                                <span className="stat-label">Tasks Done</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-value">{reflection.focusHours}h</span>
                                <span className="stat-label">Focus Time</span>
                            </div>
                        </div>
                        <div className="reflection-insight">
                            <FaLightbulb className="insight-icon icon-small" />
                            <p>{reflection.insight}</p>
                        </div>
                    </div>
                </div>
            </div>

            <TaskInput />
        </div>
    );
};

export default Dashboard;
