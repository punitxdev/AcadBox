import React, { useState, useEffect } from 'react';
import './EventModal.css';

const EventModal = ({ date, event, onSave, onDelete, onClose }) => {
    const [title, setTitle] = useState('');
    const [type, setType] = useState('Academic');
    const [note, setNote] = useState('');
    const [reminder, setReminder] = useState(false);

    useEffect(() => {
        if (event) {
            setTitle(event.title);
            setType(event.type);
            setNote(event.note || '');
            setReminder(event.reminder || false);
        }
    }, [event]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) {
            alert('Please enter a title');
            return;
        }

        onSave({
            title: title.trim(),
            type,
            note: note.trim(),
            reminder
        });
    };

    const formatDate = (dateStr) => {
        const d = new Date(dateStr + 'T00:00:00');
        return d.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>{event ? 'Edit Event' : 'Add Event'}</h3>
                    <p className="modal-date">{formatDate(date)}</p>
                </div>

                <form onSubmit={handleSubmit} className="event-form">
                    <div className="form-group">
                        <label htmlFor="title">
                            Title <span className="required">*</span>
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., Mid-term Exam"
                            autoFocus
                            maxLength={50}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="type">Type</label>
                        <select
                            id="type"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                        >
                            <option value="Academic">Academic</option>
                            <option value="Personal">Personal</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="note">Note (Optional)</label>
                        <textarea
                            id="note"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Add any additional details..."
                            rows={3}
                            maxLength={200}
                        />
                    </div>

                    <div className="form-group checkbox-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={reminder}
                                onChange={(e) => setReminder(e.target.checked)}
                            />
                            <span>Remind me on this day</span>
                        </label>
                    </div>

                    <div className="modal-actions">
                        {event && (
                            <button
                                type="button"
                                className="delete-btn"
                                onClick={onDelete}
                            >
                                Delete
                            </button>
                        )}
                        <div className="action-buttons">
                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                            <button type="submit" className="save-btn">
                                {event ? 'Update' : 'Save'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EventModal;
