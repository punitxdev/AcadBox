export const MOCK_DATA = {
    courses: [
        { id: 101, name: 'Advanced Algorithms', credits: 4, color: '#ef4444', semester: 'Semester 5' },
        { id: 102, name: 'Database Systems', credits: 3, color: '#3b82f6', semester: 'Semester 5' },
        { id: 103, name: 'Computer Networks', credits: 3, color: '#10b981', semester: 'Semester 5' },
        { id: 104, name: 'Machine Learning', credits: 4, color: '#8b5cf6', semester: 'Semester 5' },
        { id: 105, name: 'Software Engineering', credits: 3, color: '#f59e0b', semester: 'Semester 5' }
    ],
    tasks: [
        { id: 1, title: 'Algo: Dynamic Programming Set', courseId: 101, type: 'Assignment', deadline: new Date(Date.now() + 86400000).toISOString().split('T')[0], effort: 5, status: 'pending' },
        { id: 2, title: 'DB: Normalization Quiz', courseId: 102, type: 'Quiz', deadline: new Date(Date.now() + 172800000).toISOString().split('T')[0], effort: 2, status: 'pending' },
        { id: 3, title: 'ML: Model Training Report', courseId: 104, type: 'Project', deadline: new Date(Date.now() + 259200000).toISOString().split('T')[0], effort: 8, status: 'pending' },
        { id: 4, title: 'Networks: Packet Tracer Lab', courseId: 103, type: 'Lab', deadline: new Date(Date.now() - 86400000).toISOString().split('T')[0], effort: 3, status: 'pending' }, // Overdue
        { id: 5, title: 'SE: Requirement Docs', courseId: 105, type: 'Assignment', deadline: new Date(Date.now() + 432000000).toISOString().split('T')[0], effort: 4, status: 'completed' }
    ],
    attendance: [
        { courseId: 101, attended: 22, total: 30 }, // 73% (Risk)
        { courseId: 102, attended: 28, total: 30 }, // 93% (Safe)
        { courseId: 103, attended: 15, total: 25 }, // 60% (Critical)
        { courseId: 104, attended: 25, total: 28 }, // 89% (Safe)
        { courseId: 105, attended: 18, total: 20 }  // 90% (Safe)
    ],
    grades: [
        { id: 1, courseId: 101, type: 'Mid-Sem', title: 'Mid-Sem', scored: 12, total: 30, date: '2025-10-15', weightage: 30 },
        { id: 2, courseId: 102, type: 'Quiz', title: 'Quiz 1', scored: 9, total: 10, date: '2025-09-20', weightage: 10 },
        { id: 3, courseId: 104, type: 'Assignment', title: 'Assignment 1', scored: 45, total: 50, date: '2025-09-25', weightage: 20 }
    ],
    focusSessions: [
        { id: 1, taskId: 5, duration: 45, status: 'completed', timestamp: new Date(Date.now() - 86400000).toISOString() },
        { id: 2, taskId: 1, duration: 20, status: 'broken', breakReason: 'App backgrounded', timestamp: new Date(Date.now() - 172800000).toISOString() }
    ],
    streak: {
        current: 3,
        history: [
            { date: new Date(Date.now() - 86400000).toISOString().split('T')[0], status: 'solid' },
            { date: new Date(Date.now() - 172800000).toISOString().split('T')[0], status: 'solid' },
            { date: new Date(Date.now() - 259200000).toISOString().split('T')[0], status: 'solid' }
        ],
        status: 'solid',
        lastLogDate: new Date(Date.now() - 86400000).toISOString().split('T')[0]
    },
    currentSemester: 'Semester 5',
    semesters: ['Semester 5']
};
