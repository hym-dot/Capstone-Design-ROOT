const express = require('express');
const cors = require('cors');
const db = require('./database.js');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// 1. 블랙리스트 확인 API
app.post('/api/check', (req, res) => {
    const { type, value } = req.body;
    if (!type || !value) {
        return res.status(400).json({ error: 'Type and value are required' });
    }

    const sql = "SELECT * FROM items WHERE type = ? AND value = ?";
    db.get(sql, [type, value], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (row) {
            res.json({ isBlacklisted: true, data: row });
        } else {
            res.json({ isBlacklisted: false });
        }
    });
});

// 2. 블랙리스트 전체 목록 조회 API
app.get('/api/blacklist', (req, res) => {
    const sql = "SELECT * FROM items ORDER BY createdAt DESC";
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ data: rows });
    });
});


// 3. 블랙리스트 추가 API
app.post('/api/blacklist', (req, res) => {
    const { type, value } = req.body;
    const sql = "INSERT INTO items (type, value) VALUES (?, ?)";
    db.run(sql, [type, value], function (err) {
        if (err) {
            return res.status(400).json({ error: "Already exists or invalid data" });
        }
        res.json({ message: 'Added to blacklist', id: this.lastID });
    });
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});