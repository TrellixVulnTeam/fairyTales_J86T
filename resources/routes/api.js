const { application } = require('express');
const express = require('express');
const db = require.main.require('./db/db.js');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

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
        if (!rows[0]) {
            res.status(404).send('');
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
    const query = req.body.q;
    const b2 = (req.body.b2 === "true") ? 0: 2;
    const b3 = (req.body.b3 === "true") ? 0: 3;
    const b4 = (req.body.b4 === "true") ? 0: 4;
    let sort;
    switch(req.body.sort) {
        case "az":
            sort = "title ASC";
            break;
        case "za":
            sort = "title DESC";
            break;
        case "24":
            sort = "class ASC";
            break;
        case "42":
            sort = "class DESC";
            break;
        default:
            sort = "title ASC";
    }

    db.all(`SELECT * FROM fairytales WHERE title LIKE ? AND class NOT IN (?, ?, ?) ORDER BY ${sort}`, ['%' + query + '%', b2, b3, b4], (err, rows) => {
        if (err) {
            res.send(err);
            throw err;
        }
        if (!query) {res.status(404); rows = [];}
        if (!rows[0]) res.status(404)
        res.send(rows);
    });
});

router.get('/base64', (req, res) => {
    const id = req.query.id
    db.all("SELECT image FROM fairytales WHERE id = ?", [id], (err, rows) => {
        if (rows[0]) {
            const base64 = rows[0].image.split(',')[1];
            const buffer = Buffer.from(base64, 'base64');
            res.set('Content-Type', 'image/jpeg')
            res.send(buffer);
        }
        else res.status(404).send('');
    });
});

module.exports = router;