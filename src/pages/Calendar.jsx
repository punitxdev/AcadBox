import React, { useState, useEffect } from 'react';
import { useAcademic } from '../context/AcademicContext';
import EventModal from '../components/EventModal';
import ReminderToast from '../components/ReminderToast';
import { FaBell, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './Calendar.css';

// Public holidays for India
const PUBLIC_HOLIDAYS = [
    { date: '2025-01-26', name: 'Republic Day' },
    { date: '2025-03-14', name: 'Holi' },
    { date: '2025-04-14', name: 'Dr. Ambedkar Jayanti' },
    { date: '2025-08-15', name: 'Independence Day' },
    { date: '2025-10-02', name: 'Gandhi Jayanti' },
    { date: '2025-10-22', name: 'Dussehra' },
    { date: '2025-11-12', name: 'Diwali' },
    { date: '2025-12-25', name: 'Christmas' }
];

const Calendar = () => {
    const { calendarEvents, addCalendarEvent, editCalendarEvent, deleteCalendarEvent } = useAcademic();

    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [showEventModal, setShowEventModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [showReminders, setShowReminders] = useState(false);

    // Check for today's reminders on mount
    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        const todayReminders = calendarEvents.filter(e => e.date === today && e.reminder);
        if (todayReminders.length > 0) {
            setShowReminders(true);
        }
    }, []);

    // Calendar helper functions
    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month, 1).getDay();
    };

    const formatDateString = (year, month, day) => {
        const m = String(month + 1).padStart(2, '0');
        const d = String(day).padStart(2, '0');
        return `${year}-${m}-${d}`;
    };

    const isToday = (year, month, day) => {
        const today = new Date();
        return today.getFullYear() === year &&
            today.getMonth() === month &&
            today.getDate() === day;
    };

    const getEventsForDate = (dateStr) => {
        return calendarEvents.filter(e => e.date === dateStr);
    };

    const getHolidayForDate = (dateStr) => {
        return PUBLIC_HOLIDAYS.find(h => h.date === dateStr);
    };

    // Navigation
    const goToPreviousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const goToNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    // Event handling
    const handleDateClick = (dateStr) => {
        setSelectedDate(dateStr);
        setEditingEvent(null);
        setShowEventModal(true);
    };

    const handleEventClick = (event, e) => {
        e.stopPropagation();
        setSelectedDate(event.date);
        setEditingEvent(event);
        setShowEventModal(true);
    };

    const handleSaveEvent = (eventData) => {
        if (editingEvent) {
            editCalendarEvent(editingEvent.id, eventData);
        } else {
            addCalendarEvent({ ...eventData, date: selectedDate });
        }
        setShowEventModal(false);
        setEditingEvent(null);
    };

    const handleDeleteEvent = () => {
        if (editingEvent) {
            deleteCalendarEvent(editingEvent.id);
            setShowEventModal(false);
            setEditingEvent(null);
        }
    };

    // Render calendar grid
    const renderCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDay = getFirstDayOfMonth(currentDate);

        const days = [];

        // Empty cells for days before month starts
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = formatDateString(year, month, day);
            const events = getEventsForDate(dateStr);
            const holiday = getHolidayForDate(dateStr);
            const hasReminder = events.some(e => e.reminder);
            const today = isToday(year, month, day);

            days.push(
                <div
                    key={day}
                    className={`calendar-day ${today ? 'today' : ''} ${holiday ? 'holiday' : ''}`}
                    onClick={() => handleDateClick(dateStr)}
                >
                    <div className="day-number">
                        {day}
                        {hasReminder && <FaBell className="reminder-icon" />}
                    </div>

                    {holiday && (
                        <div className="holiday-label">{holiday.name}</div>
                    )}

                    {events.map(event => (
                        <div
                            key={event.id}
                            className={`event-label ${event.type.toLowerCase()}`}
                            onClick={(e) => handleEventClick(event, e)}
                        >
                            {event.title}
                        </div>
                    ))}
                </div>
            );
        }

        return days;
    };

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    return (
        <div className="calendar-page">
            <header className="page-header">
                <h1 className="page-title">Calendar</h1>
                <p className="date-display">Academic & Personal Events</p>
            </header>

            <div className="calendar-container">
                <div className="calendar-header">
                    <button className="nav-btn" onClick={goToPreviousMonth}>
                        <FaChevronLeft />
                    </button>
                    <div className="month-year">
                        <h2>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
                        <button className="today-btn" onClick={goToToday}>Today</button>
                    </div>
                    <button className="nav-btn" onClick={goToNextMonth}>
                        <FaChevronRight />
                    </button>
                </div>

                <div className="calendar-grid">
                    <div className="weekday-header">Sun</div>
                    <div className="weekday-header">Mon</div>
                    <div className="weekday-header">Tue</div>
                    <div className="weekday-header">Wed</div>
                    <div className="weekday-header">Thu</div>
                    <div className="weekday-header">Fri</div>
                    <div className="weekday-header">Sat</div>

                    {renderCalendar()}
                </div>

                <div className="calendar-legend">
                    <div className="legend-item">
                        <span className="legend-dot academic"></span>
                        Academic
                    </div>
                    <div className="legend-item">
                        <span className="legend-dot personal"></span>
                        Personal
                    </div>
                    <div className="legend-item">
                        <FaBell className="legend-icon" />
                        Reminder
                    </div>
                </div>
            </div>

            {showEventModal && (
                <EventModal
                    date={selectedDate}
                    event={editingEvent}
                    onSave={handleSaveEvent}
                    onDelete={handleDeleteEvent}
                    onClose={() => {
                        setShowEventModal(false);
                        setEditingEvent(null);
                    }}
                />
            )}

            {showReminders && (
                <ReminderToast
                    events={calendarEvents.filter(e =>
                        e.date === new Date().toISOString().split('T')[0] && e.reminder
                    )}
                    onClose={() => setShowReminders(false)}
                />
            )}
        </div>
    );
};

export default Calendar;
