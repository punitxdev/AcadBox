const fetch = require('node-fetch'); // Need to install node-fetch or use built-in fetch if node version supports it (Node 18+)

// Node 18+ has built-in fetch, so we might not need node-fetch if the environment is new enough.
// The user is on Linux, likely a recent Node version. Let's try built-in fetch first.

const BASE_URL = 'http://localhost:5000/api/ai';

async function testEndpoint(name, endpoint, data) {
    console.log(`\n--- Testing ${name} ---`);
    try {
        const response = await fetch(`${BASE_URL}/${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log(`Input:`, JSON.stringify(data, null, 2));
        console.log(`AI Insight: "${result.insight}"`);
        return true;
    } catch (error) {
        console.error(`FAILED: ${error.message}`);
        return false;
    }
}

async function runTests() {
    console.log("Starting AI API Tests...");

    // 1. Focus Session Analysis
    await testEndpoint('Focus Session (Success)', 'focus-analysis', {
        plannedDuration: 60,
        actualDuration: 60,
        status: 'completed',
        taskTitle: 'Deep Work: Chapter 1'
    });

    // 2. Dashboard Risk
    await testEndpoint('Dashboard Risk (High)', 'dashboard-insight', {
        streak: 0,
        weeklyFocusHours: 1,
        pendingDeadlines: 8
    });

    // 3. Attendance Risk
    await testEndpoint('Attendance (Critical)', 'attendance-risk', {
        percentage: 65,
        safeThreshold: 75
    });

    console.log("\nTests Completed.");
}

runTests();
