import React, { useState, useEffect } from 'react';
import { useAcademic } from '../context/AcademicContext';
import { FaInfoCircle, FaEdit, FaTrash } from 'react-icons/fa';
import './SmartSchedule.css';

const SmartSchedule = () => {
    const { courses, getAttendanceStatus, fetchAIInsight, tasks, editTask, deleteTask, aiPrioritizedTasks, isAiLoading } = useAcademic();
    const [editingTask, setEditingTask] = useState(null); // State for modal
    const [editForm, setEditForm] = useState({ title: '', deadline: '', effort: '', type: '' });

    // Removed local AI fetching useEffect - using aiPrioritizedTasks from context

    const getCourseColor = (id) => courses.find(c => c.id === id)?.color || '#555';

    const isOverdue = (deadline) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return new Date(deadline) < today;
    };

    // Helper to filter tasks for a day
    const getTasksForDay = (day) => {
        if (isAiLoading || aiPrioritizedTasks.length === 0) {
            return [];
        }
        const todayTasks = aiPrioritizedTasks.filter(t => t.ai_priority_label === 'Today');
        const tomorrowTasks = aiPrioritizedTasks.filter(t => t.ai_priority_label === 'Tomorrow' || t.ai_priority_label === 'Low');
        if (day === 'Today') {
            // Ensure at least 5 tasks by pulling from tomorrowTasks
            if (todayTasks.length < 5) {
                const needed = 5 - todayTasks.length;
                const extra = tomorrowTasks.slice(0, needed);
                return [...todayTasks, ...extra];
            }
            return todayTasks;
        }
        // For Tomorrow column, exclude any tasks shifted to Today
        if (day === 'Tomorrow') {
            const shiftedCount = Math.max(0, 5 - todayTasks.length);
            return tomorrowTasks.slice(shiftedCount);
        }
        return [];
    };

    if (isAiLoading && aiPrioritizedTasks.length === 0) {
        return (
            <div className="schedule-page">
                <header className="page-header">
                    <h1>Smart Schedule</h1>
                    <p className="date-display">AI-Optimized Study Plan</p>
                </header>
                <div className="schedule-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
                    <div className="ai-thinking-container">
                        <div className="ai-pulse-ring"></div>
                        <p className="ai-thinking-text">AI is analyzing your workload...</p>
                        <p className="ai-subtext">Optimizing for deadlines, effort, and academic health</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="schedule-page">
            <header className="page-header">
                <h1>Smart Schedule</h1>
                <p className="date-display">AI-Optimized Study Plan (AI Active)</p>
            </header>

            <div className="schedule-container">
                {['Today', 'Tomorrow'].map(day => (
                    <div key={day} className="day-column">
                        <h3 className="day-title">{day}</h3>
                        <div className="day-timeline">
                            {getTasksForDay(day).map(task => (
                                <div key={task.id} className="timeline-item" style={{ borderLeftColor: getCourseColor(task.courseId) }}>
                                    <div className="timeline-time">{task.effort}h</div>
                                    <div className="timeline-content">
                                        <div className="timeline-header">
                                            <h4>{task.title}</h4>
                                            <div className="ai-explanation-tooltip">
                                                <FaInfoCircle className="info-icon-small" />
                                                <div className="tooltip-content-wide">
                                                    AI Priority: {task.ai_priority_label || 'Calculating...'}
                                                </div>
                                            </div>
                                            {day === 'Today' && task.ai_priority_label !== 'Today' && (
                                                <span className="shifted-badge" style={{ marginLeft: '8px', color: '#f59e0b', fontSize: '0.8rem' }}>(Can do today)</span>
                                            )}
                                        </div>
                                        <div className="timeline-meta">
                                            <span className="timeline-tag">{task.type}</span>
                                            {/* Edit and Delete actions */}
                                            <FaEdit className="action-icon" style={{ marginLeft: '8px', cursor: 'pointer' }} onClick={() => {
                                                setEditingTask(task.id);
                                                setEditForm({ title: task.title, deadline: task.deadline, effort: task.effort, type: task.type });
                                            }} />
                                            <FaTrash className="action-icon" style={{ marginLeft: '4px', cursor: 'pointer', color: 'red' }} onClick={() => {
                                                if (confirm('Delete this task?')) deleteTask(task.id);
                                            }} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {getTasksForDay(day).length === 0 && (
                                <p className="empty-slot">Free day! Relax or review.</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Edit Task Modal */}
            {editingTask && (
                <div className="modal-overlay" style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
                }}>
                    <div className="modal-content" style={{
                        background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '12px', width: '400px',
                        border: '1px solid var(--border-color)'
                    }}>
                        <h3 style={{ marginBottom: '1rem' }}>Edit Task</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <label>
                                Title:
                                <input
                                    type="text"
                                    value={editForm.title}
                                    onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                                    style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
                                />
                            </label>
                            <label>
                                Deadline:
                                <input
                                    type="date"
                                    value={editForm.deadline}
                                    onChange={e => setEditForm({ ...editForm, deadline: e.target.value })}
                                    style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
                                />
                            </label>
                            <label>
                                Effort (hours):
                                <input
                                    type="number"
                                    value={editForm.effort}
                                    onChange={e => setEditForm({ ...editForm, effort: Number(e.target.value) })}
                                    style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
                                />
                            </label>
                            <label>
                                Type:
                                <select
                                    value={editForm.type}
                                    onChange={e => setEditForm({ ...editForm, type: e.target.value })}
                                    style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
                                >
                                    <option value="Assignment">Assignment</option>
                                    <option value="Exam">Exam</option>
                                    <option value="Project">Project</option>
                                    <option value="Quiz">Quiz</option>
                                </select>
                            </label>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1rem' }}>
                                <button onClick={() => setEditingTask(null)} style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>Cancel</button>
                                <button onClick={() => {
                                    editTask(editingTask, editForm);
                                    setEditingTask(null);
                                }} style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', background: 'var(--accent-blue)', color: 'white' }}>Save Changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SmartSchedule;
