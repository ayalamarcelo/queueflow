const express = require('express');
const cors = require('cors');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '.env') });

const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// POST /queue Agregar cliente
app.post('/queue', (req, res) => {
    const { client_id, first_name, last_name } = req.body;

    const sql = `
        INSERT INTO queue_records (client_id, first_name, last_name)
        VALUES (?, ?, ?)
    `;

    db.query(sql, [client_id, first_name, last_name], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to insert record into database' });
        }

        res.status(201).json({ message: 'Client added to the queue.' });
    });
});

// PATCH /queue/next Atiende al siguiente cliente
app.patch('/queue/next', (req, res) => {
    const selectSql = `
        SELECT id, first_name, last_name, served_at
        FROM queue_records
        WHERE is_served = 0
        ORDER BY created_at ASC
        LIMIT 1
    `;

    db.query(selectSql, (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to retrieve record from database' });
        }

        if (rows.length === 0) {
            return res.status(404).json({ error: 'No clients waiting in the queue.' });
        }

        const nextClient = rows[0];

        const updateSql = `
            UPDATE queue_records
            SET is_served = 1,
                served_at = NOW()
            WHERE id = ?
        `;

        db.query(updateSql, [nextClient.id], (updateErr) => {
            if (updateErr) {
                console.error(updateErr);
                return res.status(500).json({ error: 'Failed to update record in database' });
            }

            res.json({
                message: `Now serving: ${nextClient.first_name} ${nextClient.last_name}`
            });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});