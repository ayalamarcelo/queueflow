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
    const sql = 'INSERT INTO queue_records (client_id, first_name, last_name) VALUES (?, ?, ?)';

    db.query(sql, [client_id, first_name, last_name], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to insert record into database' });
        }
        res.status(201).json({ message: 'Client added to the queue.' });
    });
});

// PATCH: Atiende al siguiente cliente
app.patch('/queue/next', (req, res) => {
    // 1. Buscamos primero al siguiente cliente que no ha sido atendido (is_served = 0)
    const selectSql = 'SELECT first_name, last_name FROM queue_records WHERE is_served = FALSE ORDER BY created_at ASC LIMIT 1';

    db.query(selectSql, (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to retrieve record from database' });
        }

        // Si no hay nadie en la fila, avisamos de inmediato
        if (rows.length === 0) {
            return res.status(404).json({ error: 'No clients waiting in the queue.' });
        }

        const nextClient = rows[0];
        // Conservamos exactamente tu misma lógica de UPDATE para marcarlo como atendido
        const updateSql = `UPDATE queue_records SET is_served = TRUE, served_at = NOW() WHERE id = (SELECT id FROM (SELECT id FROM queue_records WHERE is_served = FALSE ORDER BY created_at ASC LIMIT 1) AS temp)`;

        db.query(updateSql, (updateErr, updateResult) => {
            if (updateErr) {
                console.error(updateErr);
                return res.status(500).json({ error: 'Failed to update record in database' });
            }

            // 2. Respondemos con el string formateado en inglés que espera tu frontend
            const clientName = `Now serving: ${nextClient.first_name} ${nextClient.last_name}`;
            res.json({ message: clientName });
        });
    });
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});