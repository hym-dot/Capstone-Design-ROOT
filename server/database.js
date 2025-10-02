const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./blacklist.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the blacklist database.');
});

// 블랙리스트 테이블 생성
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,
    value TEXT NOT NULL UNIQUE,
    createdAt TEXT DEFAULT (datetime('now', 'localtime'))
  )`, (err) => {
        if (err) {
            return console.error(err.message);
        }
        // 테스트용 데이터 추가
        const stmt = db.prepare("INSERT OR IGNORE INTO items (type, value) VALUES (?, ?)");
        stmt.run('ip', '192.168.1.100');
        stmt.run('email', 'spammer@example.com');
        stmt.finalize();
    });
});

module.exports = db;