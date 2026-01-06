import React from 'react';
import { FaBell, FaTimes } from 'react-icons/fa';
import './ReminderToast.css';

const ReminderToast = ({ events, onClose }) => {
    if (!events || events.length === 0) return null;

    return (
        <div className="reminder-toast">
            <div className="toast-header">
                <div className="toast-icon">
                    <FaBell />
                </div>
                <h4>Reminders for Today</h4>
                <button className="close-toast" onClick={onClose}>
                    <FaTimes />
                </button>
            </div>
            <div className="toast-body">
                {events.map(event => (
                    <div key={event.id} className="reminder-item">
                        <div className="reminder-title">{event.title}</div>
                        {event.note && (
                            <div className="reminder-note">{event.note}</div>
                        )}
                        <div className={`reminder-type ${event.type.toLowerCase()}`}>
                            {event.type}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReminderToast;
