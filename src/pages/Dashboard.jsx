import React, { useState, useEffect } from 'react';
import { useAcademic } from '../context/AcademicContext';
import TaskInput from '../components/TaskInput';
import { FaCheckCircle, FaFire } from 'react-icons/fa';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import FocusTimer from '../components/FocusTimer';
import './Dashboard.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
    const {
        getAcademicHealthBreakdown,
        getWeeklyReflection,
        tasks,
        streak,
        fetchAIInsight,
        courses,
        completeTask,
        getPriorityExplanation,
        aiPrioritizedTasks,
        isAiLoading,
        getGpaInsight
    } = useAcademic();

    const health = getAcademicHealthBreakdown();
    const reflection = getWeeklyReflection();
    const [dashboardInsight, setDashboardInsight] = useState("Analyzing academic momentum...");
    const [aiHealth, setAiHealth] = useState(null);

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
                averageGrade: (health.gradePerformance / 100) * 10,
                focusHoursWeek: parseFloat(reflection.focusHours),
                streakConsistency: streak.status === 'solid' ? 1.0 : 0.5,
                overdueRatio: 0.1
            });

            if (healthData && healthData.academic_health_score !== undefined) {
                setAiHealth(healthData);
            }
        };
        getInsight();
    }, [streak.current, reflection.focusHours, tasks, fetchAIInsight]);

    const pendingTasks = tasks.filter(t => t.status === 'pending');
    const completedTasks = tasks.filter(t => t.status === 'completed');

    const localHealthScore = Math.round(
        (health.taskCompletion * 0.3) +
        (health.focusConsistency * 0.2) +
        (health.gradePerformance * 0.2) +
        (health.attendancePerformance * 0.3)
    );

    const displayHealthScore = aiHealth ? aiHealth.academic_health_score : localHealthScore;
    const displayHealthStatus = aiHealth ? aiHealth.health_status : (localHealthScore > 80 ? "Excellent" : "Needs Attention");

    const chartData = {
        labels: ['Health Score', 'Gap'],
        datasets: [
            {
                data: [displayHealthScore, 100 - displayHealthScore],
                backgroundColor: [
                    displayHealthScore >= 80 ? '#10b981' : displayHealthScore >= 60 ? '#f59e0b' : '#ef4444',
                    '#e2e8f0'
                ],
                borderWidth: 0,
                cutout: '85%',
            },
        ],
    };

    const getCourseName = (id) => courses.find(c => c.id === id)?.name || 'Unknown';

    // Get the top priority task for the focus timer
    const currentFocusTask = aiPrioritizedTasks.length > 0
        ? { ...aiPrioritizedTasks[0], courseName: getCourseName(aiPrioritizedTasks[0].courseId) }
        : null;

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <div className="header-left">
                    <h1>Command Center</h1>
                    <p className="date-display">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                </div>
                <div className="header-right">
                    <div className="ai-status-badge">
                        <div className="ai-pulse"></div>
                        <span>AI ACTIVE</span>
                    </div>
                </div>
            </header>

            <div className="dashboard-main-grid">
                {/* Center Stage: Focus Timer */}
                <div className="main-panel">
                    <FocusTimer currentTask={currentFocusTask} onComplete={completeTask} />

                    {/* AI Insight Below Timer */}
                    <div className="ai-insight-bar">
                        <span className="ai-label">SYSTEM INSIGHT</span>
                        <p>{dashboardInsight}</p>
                    </div>
                </div>

                {/* Right Panel: Stats & Health */}
                <div className="right-panel">
                    {/* Health Widget */}
                    <div className="health-widget">
                        <div className="widget-header">
                            <h3>Academic Health</h3>
                            {aiHealth && <span className="ai-badge-small" title="AI Enhanced">AI</span>}
                        </div>
                        <div className="health-chart-wrapper">
                            <div className="health-score-display">
                                <span className="score-value">{displayHealthScore}%</span>
                            </div>
                            <Doughnut data={chartData} options={{ plugins: { legend: { display: false }, tooltip: { enabled: false } } }} />
                        </div>
                        <p className="health-status-text" style={{ color: displayHealthScore >= 80 ? 'var(--accent-green)' : displayHealthScore >= 60 ? '#f59e0b' : 'var(--accent-red)' }}>
                            {displayHealthStatus}
                        </p>
                    </div>

                    {/* Streak Widget */}
                    <div className="streak-widget">
                        <div className={`streak-fire ${streak.status === 'cracked' ? 'cracked' : ''}`}>
                            <FaFire />
                        </div>
                        <div className="streak-details">
                            <span className="streak-count">{streak.current} Days</span>
                            <span className="streak-label">Consistency Streak</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Panel: Upcoming Tasks */}
            <div className="bottom-panel">
                <h3 className="section-title">Upcoming Priorities</h3>
                <div className="horizontal-task-list">
                    {aiPrioritizedTasks.slice(1, 5).map(task => (
                        <div key={task.id} className="task-card-compact">
                            <div className="task-card-header">
                                <span className="task-course-tag">
                                    {getCourseName(task.courseId)}
                                </span>
                                <span className="task-effort">{task.effort}h</span>
                            </div>
                            <h4>{task.title}</h4>
                            <div className="task-card-footer">
                                <span className="task-due">Due {task.deadline}</span>
                                <button className="btn-icon-small" onClick={() => completeTask(task.id)}>
                                    <FaCheckCircle />
                                </button>
                            </div>
                        </div>
                    ))}
                    {aiPrioritizedTasks.length < 2 && (
                        <div className="empty-tasks-placeholder">
                            <p>No other urgent tasks. You're all caught up!</p>
                        </div>
                    )}
                </div>
            </div>

            <TaskInput />
        </div>
    );
};

export default Dashboard;
