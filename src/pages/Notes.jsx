import React, { useState } from 'react';
import { useAcademic } from '../context/AcademicContext';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import './Notes.css';

const Notes = () => {
    const { notes, addNote, editNote, deleteNote } = useAcademic();

    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingNote, setEditingNote] = useState(null);
    const [noteForm, setNoteForm] = useState({ title: '', content: '' });

    const filteredNotes = notes.filter(note =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleOpenModal = (note = null) => {
        if (note) {
            setEditingNote(note);
            setNoteForm({ title: note.title, content: note.content });
        } else {
            setEditingNote(null);
            setNoteForm({ title: '', content: '' });
        }
        setShowModal(true);
    };

    const handleSaveNote = () => {
        if (!noteForm.title.trim()) {
            alert('Please enter a title');
            return;
        }

        if (editingNote) {
            editNote(editingNote.id, noteForm);
        } else {
            addNote(noteForm);
        }

        setShowModal(false);
        setNoteForm({ title: '', content: '' });
        setEditingNote(null);
    };

    const handleDeleteNote = (noteId) => {
        if (window.confirm('Delete this note?')) {
            deleteNote(noteId);
        }
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="notes-page">
            <header className="page-header">
                <h1 className="page-title">Notes</h1>
                <p className="date-display">Quick Notes & Ideas</p>
            </header>

            <div className="notes-toolbar">
                <div className="search-box">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search notes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                </div>
                <button className="add-note-btn" onClick={() => handleOpenModal()}>
                    <FaPlus /> Add Note
                </button>
            </div>

            <div className="notes-grid">
                {filteredNotes.length > 0 ? (
                    filteredNotes.map(note => (
                        <div key={note.id} className="note-card">
                            <div className="note-header">
                                <h3 className="note-title">{note.title}</h3>
                                <div className="note-actions">
                                    <button
                                        className="note-action-btn"
                                        onClick={() => handleOpenModal(note)}
                                        title="Edit"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        className="note-action-btn delete"
                                        onClick={() => handleDeleteNote(note.id)}
                                        title="Delete"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                            <p className="note-content">{note.content}</p>
                            <div className="note-footer">
                                <span className="note-date">{formatDate(note.timestamp)}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-notes-state">
                        <p>No notes yet. Click "Add Note" to create your first note.</p>
                    </div>
                )}
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{editingNote ? 'Edit Note' : 'Add Note'}</h3>
                        </div>

                        <div className="note-form">
                            <div className="form-group">
                                <label htmlFor="note-title">
                                    Title <span className="required">*</span>
                                </label>
                                <input
                                    id="note-title"
                                    type="text"
                                    value={noteForm.title}
                                    onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
                                    placeholder="Note title..."
                                    autoFocus
                                    maxLength={100}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="note-content">Content</label>
                                <textarea
                                    id="note-content"
                                    value={noteForm.content}
                                    onChange={(e) => setNoteForm({ ...noteForm, content: e.target.value })}
                                    placeholder="Write your note here..."
                                    rows={10}
                                />
                            </div>

                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="save-btn"
                                    onClick={handleSaveNote}
                                >
                                    {editingNote ? 'Update' : 'Save'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notes;
