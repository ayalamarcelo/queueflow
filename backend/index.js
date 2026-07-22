const express = require('express');
const cors = require('cors');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '.env') });

const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// si el cliente existe
// async function clientExists(clientId) {
//     const sql = 'SELECT id FROM queue_records WHERE client_id = ?';
//     const [rows] = await db.query(sql, [clientId]);
//     return rows.length > 0;
// }

function clientExist(clientId) {
    // res y rej funciones
    return new Promise((res, rej) => {
        const sql = 'SELECT id FROM queue_records WHERE client_id = ?';
        const [rows] = db.query(sql, [clientId])
        .then((queryResult) => {
            const [rows] = queryResult;
            res(rows.length > 0);
        });
    });
}

// Promesas: =>
// Promesa comun y corriente con un Timeout
// 3 promesas corran paralelas y fallen si falla solo una
// 3 promesas que corran una despues de la otra, en paralelo, serie.





// POST /queue - Agregar cliente
app.post('/queue', async (req, res) => {
    const { client_id, first_name, last_name } = req.body;

    try {
        const exists = await clientExists(client_id);
        if (exists) {
            return res.status(400).json({ error: 'Client is already in the system.' });
        }

        const sql = `
            INSERT INTO queue_records (client_id, first_name, last_name)
            VALUES (?, ?, ?)
        `;
        await db.query(sql, [client_id, first_name, last_name]);
        res.status(201).json({ message: 'Client added to the queue.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to insert record into database' });
    }
});

// PATCH /queue/next - Atiende al siguiente cliente
app.patch('/queue/next', async (req, res) => {
    const selectSql = `
        SELECT id, first_name, last_name, served_at
        FROM queue_records
        WHERE is_served = 0
        ORDER BY created_at ASC
        LIMIT 1
    `;

    const updateSql = `
        UPDATE queue_records
        SET is_served = 1,
            served_at = NOW()
        WHERE id = ?
    `;

    try {
        const [rows] = await db.query(selectSql);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'No clients waiting in the queue.' });
        }

        const nextClient = rows[0];

        await db.query(updateSql, [nextClient.id]);

        res.json({
            message: `Now serving: ${nextClient.first_name} ${nextClient.last_name}`
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to process request in database' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});