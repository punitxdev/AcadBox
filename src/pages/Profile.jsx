import React, { useState, useEffect } from 'react';
import { useAcademic } from '../context/AcademicContext';
import { FaRobot, FaSave, FaUserGraduate, FaBrain, FaChartLine, FaBullseye } from 'react-icons/fa';
import './Profile.css';

const Profile = () => {
    const { courses, profile, setProfile } = useAcademic();

    // Calculate credit load from enrolled courses
    // Assuming each course has a 'credits' property, defaulting to 3 or 4 if not present
    const calculatedCredits = courses.reduce((acc, course) => acc + (course.credits || 3), 0);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setProfile(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value
        }));
    };

    const handleSave = () => {
        // Data is already updated in context and persisted via useEffect in AcademicContext
        // Just show success feedback
        alert('Profile saved successfully! AI models updated.');
    };

    const getRiskLabel = (val) => {
        if (val === 0) return 'Conservative';
        if (val === 1) return 'Balanced';
        return 'Aggressive';
    };

    return (
        <div className="profile-page">
            <header className="profile-header">
                <h1>Student Profile</h1>
                <p>Personalize your AI academic assistant</p>
            </header>

            <div className="profile-grid">
                {/* 1. Basic Academic Information */}
                <section className="profile-section">
                    <h2><FaUserGraduate className="section-icon" /> Academic Information</h2>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            value={profile.fullName}
                            onChange={handleChange}
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label>Semester</label>
                        <select
                            name="semester"
                            value={profile.semester}
                            onChange={handleChange}
                            className="form-select"
                        >
                            <option>Semester 1 2024</option>
                            <option>Semester 2 2024</option>
                            <option>Semester 3 2025</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Branch / Major</label>
                        <select
                            name="branch"
                            value={profile.branch}
                            onChange={handleChange}
                            className="form-select"
                        >
                            <option>Computer Science</option>
                            <option>Electrical Engineering</option>
                            <option>Mechanical Engineering</option>
                            <option>Physics</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Current Credit Load</label>
                        <input
                            type="text"
                            value={`${calculatedCredits} Credits`}
                            readOnly
                            className="form-input"
                        />
                        <span className="helper-text">Auto-calculated from enrolled courses</span>
                    </div>
                </section>

                {/* 2. Study Capacity & Preferences */}
                <section className="profile-section">
                    <h2><FaBrain className="section-icon" /> Study Preferences</h2>
                    <div className="form-group">
                        <label>Daily Study Capacity (Hours)</label>
                        <input
                            type="number"
                            name="dailyCapacity"
                            value={profile.dailyCapacity}
                            onChange={handleChange}
                            min="1"
                            max="16"
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label>Preferred Study Time</label>
                        <div className="radio-group">
                            {['Morning', 'Evening', 'Night'].map(time => (
                                <label key={time} className="radio-label">
                                    <input
                                        type="radio"
                                        name="preferredTime"
                                        value={time}
                                        checked={profile.preferredTime === time}
                                        onChange={handleChange}
                                        className="radio-input"
                                    />
                                    {time}
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Break Style</label>
                        <div className="radio-group">
                            {['Short frequent breaks', 'Long focused sessions'].map(style => (
                                <label key={style} className="radio-label">
                                    <input
                                        type="radio"
                                        name="breakStyle"
                                        value={style}
                                        checked={profile.breakStyle === style}
                                        onChange={handleChange}
                                        className="radio-input"
                                    />
                                    {style}
                                </label>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 3. Academic Behavior & Risk Preferences */}
                <section className="profile-section">
                    <h2><FaChartLine className="section-icon" /> Behavior & Risk</h2>
                    <div className="form-group">
                        <label>Risk Tolerance: {getRiskLabel(profile.riskTolerance)}</label>
                        <div className="slider-container">
                            <input
                                type="range"
                                name="riskTolerance"
                                min="0"
                                max="2"
                                step="1"
                                value={profile.riskTolerance}
                                onChange={handleChange}
                                className="form-slider"
                            />
                        </div>
                        <span className="helper-text">Determines how aggressively the AI suggests skipping low-priority tasks.</span>
                    </div>
                    <div className="form-group">
                        <label>Consistency Score: {profile.consistency}</label>
                        <div className="slider-container">
                            <input
                                type="range"
                                name="consistency"
                                min="0"
                                max="1"
                                step="0.1"
                                value={profile.consistency}
                                onChange={handleChange}
                                className="form-slider"
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Procrastination Level</label>
                        <select
                            name="procrastination"
                            value={profile.procrastination}
                            onChange={handleChange}
                            className="form-select"
                        >
                            <option>Low</option>
                            <option>Medium</option>
                            <option>High</option>
                        </select>
                    </div>
                </section>

                {/* 4. Academic Goals */}
                <section className="profile-section">
                    <h2><FaBullseye className="section-icon" /> Academic Goals</h2>
                    <div className="form-group">
                        <label>Target GPA</label>
                        <input
                            type="number"
                            name="targetGpa"
                            value={profile.targetGpa}
                            onChange={handleChange}
                            step="0.1"
                            min="0"
                            max="10"
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label>Primary Focus</label>
                        <div className="radio-group">
                            {['Exams', 'Projects', 'Balanced'].map(focus => (
                                <label key={focus} className="radio-label">
                                    <input
                                        type="radio"
                                        name="primaryFocus"
                                        value={focus}
                                        checked={profile.primaryFocus === focus}
                                        onChange={handleChange}
                                        className="radio-input"
                                    />
                                    {focus}
                                </label>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 5. AI Transparency Section */}
                <div className="ai-transparency-box">
                    <FaRobot className="ai-icon" />
                    <div className="ai-text">
                        <h3>AI Personalization</h3>
                        <p>
                            Your profile data is used to personalize Academic Health scores,
                            detect overload, adjust Smart Sacrifice recommendations,
                            and improve AI task prioritization.
                        </p>
                    </div>
                </div>

                <div className="save-actions">
                    <button className="btn-save" onClick={handleSave}>
                        <FaSave style={{ marginRight: '8px' }} />
                        Save Profile
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
