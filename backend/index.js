const express = require('express');
const cors = require('cors');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '.env') });

const db = require('./db'); 

const app = express();
const PORT = process.env.PORT || 2020;

app.use(cors());
app.use(express.json());

// POST /queue Agregar cliente
app.post('/queue', (req, res) => {
    const { client_id, first_name, last_name } = req.body;
    const full_name = `${first_name} ${last_name}`;
    const sql = 'INSERT INTO queue_records (client_id, full_name) VALUES (?, ?)';

    db.query(sql, [client_id, full_name], (err, result) => {
        if(err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to insert record into database' });
        }
        res.status(201).json({ message: 'Client added to the queue.' });
    });
});

// PATCH: Atiende al siguiente cliente
app.patch('/queue/next', (req, res) => {
    const sql = `UPDATE queue_records SET is_served = TRUE, served_at = NOW() WHERE id = (SELECT id FROM (SELECT id FROM queue_records WHERE is_served = FALSE ORDER BY created_at ASC LIMIT 1) AS temp)`;

    db.query(sql, (err, result) => {
        if(err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al actualizar la fila' });
        }
        res.json({ message: 'Next client attended' });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});