import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaBook, FaCalendarAlt, FaChartBar, FaChartLine, FaClock, FaCog, FaEdit, FaUser, FaBars, FaTimes } from 'react-icons/fa';
import { useAcademic } from '../context/AcademicContext';
import logo from '../assets/logo.png';
import './Topbar.css';

const Topbar = () => {
    const { semesters, currentSemester, setCurrentSemester } = useAcademic();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const isActive = (path) => location.pathname === path ? 'active' : '';

    const navLinks = [
        { path: '/', icon: FaHome, label: 'Dashboard' },
        { path: '/courses', icon: FaBook, label: 'Courses' },
        { path: '/schedule', icon: FaCalendarAlt, label: 'Schedule' },
        { path: '/calendar', icon: FaCalendarAlt, label: 'Calendar' },
        { path: '/notes', icon: FaEdit, label: 'Notes' },
        { path: '/attendance', icon: FaChartLine, label: 'Attendance' },
        { path: '/grades', icon: FaChartBar, label: 'Grades' },
        { path: '/focus', icon: FaClock, label: 'Focus' },
    ];

    const settingsLinks = [
        { path: '/profile', icon: FaUser, label: 'Profile' },
        { path: '/settings', icon: FaCog, label: 'Settings' },
    ];

    return (
        <nav className="topbar">
            <div className="topbar-container">
                {/* Logo */}
                <div className="topbar-logo">
                    <img src={logo} alt="AcadBox" />
                    <span className="topbar-brand">AcadBox</span>
                </div>

                {/* Desktop Navigation */}
                <div className="topbar-nav">
                    {navLinks.map(link => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`topbar-link ${isActive(link.path)}`}
                        >
                            <link.icon />
                            <span>{link.label}</span>
                        </Link>
                    ))}
                </div>

                {/* Right Section */}
                <div className="topbar-right">
                    {/* Semester Selector */}
                    {semesters.length > 0 && (
                        <select
                            className="topbar-semester-select"
                            value={currentSemester}
                            onChange={(e) => setCurrentSemester(e.target.value)}
                        >
                            {semesters.map(sem => (
                                <option key={sem} value={sem}>{sem}</option>
                            ))}
                        </select>
                    )}

                    {/* Settings Links */}
                    <div className="topbar-settings">
                        {settingsLinks.map(link => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`topbar-icon-link ${isActive(link.path)}`}
                                title={link.label}
                            >
                                <link.icon />
                            </Link>
                        ))}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="mobile-menu-toggle"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <>
                    <div className="mobile-menu-overlay" onClick={() => setMobileMenuOpen(false)} />
                    <div className="mobile-menu">
                        {navLinks.map(link => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`mobile-menu-link ${isActive(link.path)}`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <link.icon />
                                <span>{link.label}</span>
                            </Link>
                        ))}
                        <div className="mobile-menu-divider" />
                        {settingsLinks.map(link => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`mobile-menu-link ${isActive(link.path)}`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <link.icon />
                                <span>{link.label}</span>
                            </Link>
                        ))}
                    </div>
                </>
            )}
        </nav>
    );
};

export default Topbar;
