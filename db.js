const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./data/grocery.db");

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
    )`);

  db.run(`CREATE TABLE IF NOT EXISTS groceries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        price REAL
    )`);

  db.get("SELECT * FROM users WHERE username='admin'", (err, row) => {
    if (!row) {
      const bcrypt = require("bcrypt");
      const hashed = bcrypt.hashSync("admin123", 10);
      db.run("INSERT INTO users(username, password) VALUES(?,?)", [
        "admin",
        hashed,
      ]);
    }
  });

  db.get("SELECT COUNT(*) as count FROM groceries", (err, row) => {
    if (row.count === 0) {
      const items = [
        ["Rice", 50],
        ["Wheat", 45],
        ["Sugar", 40],
        ["Milk", 25],
        ["Eggs", 6],
      ];
      const stmt = db.prepare("INSERT INTO groceries(name, price) VALUES(?,?)");
      items.forEach((i) => stmt.run(i[0], i[1]));
      stmt.finalize();
    }
  });
});

module.exports = db;