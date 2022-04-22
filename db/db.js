const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./db/fairytales.db', (err) => {
    if (err) {
      throw err;
    }
    db.run("CREATE TABLE IF NOT EXISTS fairytales(id INTEGER PRIMARY KEY AUTOINCREMENT, class INTEGER NOT NULL CHECK (class=2 OR class=3 OR class=4), title TEXT NOT NULL, text TEXT NOT NULL UNIQUE, image TEXT NOT NULL)");
    console.log('Connected to the database.');
  });

module.exports = db;