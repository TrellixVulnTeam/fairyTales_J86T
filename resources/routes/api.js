const express = require('express');
const db = require.main.require('./db/db.js');
const sqlite3 = require('sqlite3').verbose();

router = express.Router();
  
router.get('/b2', async(req, res) => {
    db.all("SELECT * FROM fairytales WHERE class=2", (err, rows) => {
        if (err) {
            res.send(err);
            throw err;
        }
        res.send(rows);
    });
});

router.get('/b3', async(req, res) => {
    db.all("SELECT * FROM fairytales WHERE class=3", (err, rows) => {
        if (err) {
            res.send(err);
            throw err;
        }
        res.send(rows);
    });
});

router.get('/b4', async(req, res) => {
    db.all("SELECT * FROM fairytales WHERE class=4", (err, rows) => {
        if (err) {
            res.send(err);
            throw err;
        }
        res.send(rows);
    });
});

router.get('/fairytales', async(req, res) => {
    db.all("SELECT * FROM fairytales", (err, rows) => {
        if (err) {
            res.send(err);
            throw err;
        }
        res.send(rows);
    });
});

router.get('/fairytales/:id', async(req, res) => {
    const id = parseInt(req.params.id.replace(/[^\d.-]/g, ''));
    db.all("SELECT * FROM fairytales WHERE id=?", [id], (err, rows) => {
        if (err) {
            res.send(err);
            throw err;
        }
        res.send(rows[0]);
    });
});

router.post('/add', async(req, res) => {
    const title = req.body.title;
    const classNumber = req.body.class;
    const text = req.body.text
    const image = req.body.file
    db.run("INSERT OR IGNORE INTO fairytales (title, class, text, image) VALUES (?, ?, ?, ?)", [title, classNumber, text, image], (err) => {
        if (err) {
            res.send(err);
            throw err;
        }
    })
    res.json({success: true});
})

router.post('/search', async(req, res) => {
    let query = req.body.q;
    const b2 = (req.body.b2 === "true") ? 0: 2;
    const b3 = (req.body.b3 === "true") ? 0: 3;
    const b4 = (req.body.b4 === "true") ? 0: 4;

    db.all("SELECT * FROM fairytales WHERE title LIKE ? AND class NOT IN (?, ?, ?)", ['%' + query + '%', b2, b3, b4], (err, rows) => {
        if (err) throw err;
        if (!query) {
            rows = [];
        }
        res.send(rows)
    });
});

module.exports = router;