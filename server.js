// Load environment variables
require('dotenv').config();

const express = require('express');
const mysql = require('mysql2');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Create a connection pool to the database
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// A simple test route to check if the server is running
app.get('/', (req, res) => {
    res.send('Welcome to the Campus Events API!');
});

// Endpoint to register a student for an event
app.post('/api/registrations', async (req, res) => {
    const { student_id, event_id } = req.body;
    if (!student_id || !event_id) {
        return res.status(400).send({ message: 'student_id and event_id are required' });
    }

    const connection = await pool.promise().getConnection();
    try {
        const [result] = await connection.query(
            'INSERT INTO registrations (student_id, event_id) VALUES (?, ?)',
            [student_id, event_id]
        );
        res.status(201).send({
            message: 'Registration successful!',
            registrationId: result.insertId
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).send({ message: 'Student is already registered for this event.' });
        }
        res.status(500).send({ message: 'Error registering student.', error: error.message });
    } finally {
        connection.release();
    }
});

// Endpoint to mark attendance
app.post('/api/attendance', async (req, res) => {
    const { registration_id } = req.body;
    if (!registration_id) {
        return res.status(400).send({ message: 'registration_id is required' });
    }

    const connection = await pool.promise().getConnection();
    try {
        await connection.query(
            'INSERT INTO attendance (registration_id) VALUES (?)',
            [registration_id]
        );
        res.status(201).send({ message: 'Attendance marked successfully!' });
    } catch (error) {
        res.status(500).send({ message: 'Error marking attendance.', error: error.message });
    } finally {
        connection.release();
    }
});

// Endpoint to collect feedback
app.post('/api/feedback', async (req, res) => {
    const { registration_id, rating, comments } = req.body;
    if (!registration_id || !rating) {
        return res.status(400).send({ message: 'registration_id and rating are required' });
    }

    const connection = await pool.promise().getConnection();
    try {
        await connection.query(
            'INSERT INTO feedback (registration_id, rating, comments) VALUES (?, ?, ?)',
            [registration_id, rating, comments]
        );
        res.status(201).send({ message: 'Feedback submitted successfully!' });
    } catch (error) {
        res.status(500).send({ message: 'Error submitting feedback.', error: error.message });
    } finally {
        connection.release();
    }
});

// Endpoint to get total registrations per event
app.get('/api/reports/registrations/:event_id', async (req, res) => {
    const { event_id } = req.params;
    const connection = await pool.promise().getConnection();
    try {
        const [rows] = await connection.query(
            'SELECT COUNT(*) AS total_registrations FROM registrations WHERE event_id = ?',
            [event_id]
        );
        res.status(200).send(rows[0]);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching report.', error: error.message });
    } finally {
        connection.release();
    }
});

// Endpoint to get attendance percentage per event
app.get('/api/reports/attendance/:event_id', async (req, res) => {
    const { event_id } = req.params;
    const connection = await pool.promise().getConnection();
    try {
        const [registrationCount] = await connection.query(
            'SELECT COUNT(*) AS total_registrations FROM registrations WHERE event_id = ?',
            [event_id]
        );
        const [attendanceCount] = await connection.query(
            `SELECT COUNT(DISTINCT a.registration_id) AS total_attendance
             FROM attendance a
             JOIN registrations r ON a.registration_id = r.id
             WHERE r.event_id = ?`,
            [event_id]
        );

        const totalRegistrations = registrationCount[0].total_registrations;
        const totalAttendance = attendanceCount[0].total_attendance;
        const attendancePercentage = totalRegistrations > 0 ? (totalAttendance / totalRegistrations) * 100 : 0;

        res.status(200).send({
            event_id,
            total_registrations: totalRegistrations,
            total_attendance: totalAttendance,
            attendance_percentage: attendancePercentage.toFixed(2) + '%'
        });
    } catch (error) {
        res.status(500).send({ message: 'Error fetching report.', error: error.message });
    } finally {
        connection.release();
    }
});

// Endpoint to get average feedback score per event
app.get('/api/reports/feedback/:event_id', async (req, res) => {
    const { event_id } = req.params;
    const connection = await pool.promise().getConnection();
    try {
        const [rows] = await connection.query(
            `SELECT AVG(f.rating) AS average_rating
             FROM feedback f
             JOIN registrations r ON f.registration_id = r.id
             WHERE r.event_id = ?`,
            [event_id]
        );
        const averageRating = rows[0].average_rating;

        res.status(200).send({
            event_id,
            average_feedback_score: averageRating ? parseFloat(averageRating).toFixed(2) : 'N/A'
        });
    } catch (error) {
        res.status(500).send({ message: 'Error fetching report.', error: error.message });
    } finally {
        connection.release();
    }
});

// Endpoint for Event Popularity Report
app.get('/api/reports/popularity', async (req, res) => {
    const connection = await pool.promise().getConnection();
    try {
        const [rows] = await connection.query(
            `SELECT e.title, COUNT(r.id) AS registration_count
             FROM events e
             LEFT JOIN registrations r ON e.id = r.event_id
             GROUP BY e.id
             ORDER BY registration_count DESC`
        );
        res.status(200).send(rows);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching report.', error: error.message });
    } finally {
        connection.release();
    }
});

// Endpoint for Student Participation Report
app.get('/api/reports/participation/:student_id', async (req, res) => {
    const { student_id } = req.params;
    const connection = await pool.promise().getConnection();
    try {
        const [rows] = await connection.query(
            `SELECT COUNT(a.id) AS events_attended
             FROM attendance a
             JOIN registrations r ON a.registration_id = r.id
             WHERE r.student_id = ?`,
            [student_id]
        );
        res.status(200).send(rows[0]);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching report.', error: error.message });
    } finally {
        connection.release();
    }
});

// BONUS: Query for Top 3 Most Active Students
app.get('/api/reports/top-students', async (req, res) => {
    const connection = await pool.promise().getConnection();
    try {
        const [rows] = await connection.query(
            `SELECT s.name, COUNT(a.id) AS events_attended
             FROM students s
             JOIN registrations r ON s.id = r.student_id
             JOIN attendance a ON r.id = a.registration_id
             GROUP BY s.id
             ORDER BY events_attended DESC
             LIMIT 3`
        );
        res.status(200).send(rows);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching report.', error: error.message });
    } finally {
        connection.release();
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});