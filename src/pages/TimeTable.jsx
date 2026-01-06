import React from 'react';
import { useAcademic } from '../context/AcademicContext';
import './TimeTable.css';
import { FaMapMarkerAlt } from 'react-icons/fa';

const TimeTable = () => {
    const { courses, currentSemester } = useAcademic();

    // Filter courses for the current semester
    const semesterCourses = courses.filter(c => c.semester === currentSemester);

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const timeSlots = [
        '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', 
        '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', 
        '04:00 PM', '05:00 PM'
    ];

    // Helper to find course for a specific slot
    const getCourseForSlot = (day, time) => {
        return semesterCourses.find(course => {
            // Assuming course.schedule is an object like { day: 'Monday', time: '10:00 AM' }
            // Or an array of such objects if multiple slots
            if (!course.schedule) return false;
            
            if (Array.isArray(course.schedule)) {
                return course.schedule.some(s => s.day === day && s.time === time);
            }
            return course.schedule.day === day && course.schedule.time === time;
        });
    };

    return (
        <div className="timetable-page">
            <header className="timetable-header">
                <h1>Weekly Timetable</h1>
                <p>Your schedule for {currentSemester}</p>
            </header>

            <div className="timetable-grid">
                {/* Header Row */}
                <div className="grid-header-cell">Time</div>
                {days.map(day => (
                    <div key={day} className="grid-header-cell">{day}</div>
                ))}

                {/* Time Column */}
                <div className="time-column">
                    {timeSlots.map(time => (
                        <div key={time} className="time-slot-label">{time}</div>
                    ))}
                </div>

                {/* Day Columns */}
                {days.map(day => (
                    <div key={day} className="day-column">
                        {timeSlots.map(time => {
                            const course = getCourseForSlot(day, time);
                            return (
                                <div key={`${day}-${time}`} className={`timetable-slot ${course ? 'filled' : 'empty'}`}
                                     style={course ? { 
                                         backgroundColor: `${course.color}15`, 
                                         borderLeft: `4px solid ${course.color}`,
                                         color: course.color 
                                     } : {}}>
                                    {course ? (
                                        <>
                                            <div className="slot-course-name" title={course.name}>{course.name}</div>
                                            <div className="slot-time">{time}</div>
                                            {course.location && (
                                                <div className="slot-location">
                                                    <FaMapMarkerAlt /> {course.location}
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <span style={{display: 'none'}}>Free</span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TimeTable;
