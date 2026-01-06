import React, { useState, useEffect } from 'react';
import { FaPlay, FaPause, FaStop, FaCheckCircle } from 'react-icons/fa';
import './FocusTimer.css';

const FocusTimer = ({ currentTask, onComplete }) => {
    const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes default
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState('focus'); // 'focus' or 'break'

    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(timeLeft => timeLeft - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            // Play sound or notify
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const toggleTimer = () => setIsActive(!isActive);
    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="focus-timer-container">
            <div className="focus-header">
                <span className="focus-label">Current Focus</span>
                <div className="focus-mode-badge">{mode === 'focus' ? 'Deep Work' : 'Break Time'}</div>
            </div>

            <div className="timer-display">
                <h1 className="time-text">{formatTime(timeLeft)}</h1>
            </div>

            <div className="current-task-display">
                <span className="task-label">WORKING ON</span>
                <h4 className="task-title">{currentTask ? currentTask.title : "Select a task to start"}</h4>
                {currentTask && <span className="task-course">{currentTask.courseName}</span>}
            </div>

            <div className="timer-controls">
                <button className={`control-btn play ${isActive ? 'active' : ''}`} onClick={toggleTimer}>
                    {isActive ? <FaPause /> : <FaPlay />}
                </button>
                <button className="control-btn stop" onClick={resetTimer}>
                    <FaStop />
                </button>
                {currentTask && (
                    <button className="control-btn complete" onClick={() => onComplete(currentTask.id)}>
                        <FaCheckCircle />
                    </button>
                )}
            </div>
        </div>
    );
};

export default FocusTimer;
