const express = require('express');
const db = require.main.require('./db/db.js');
const sqlite3 = require('sqlite3').verbose();

router = express.Router();

router.get('/', async(req, res) => {
    res.render('home', {title: "Home | Fairy Tales"});
})
  
router.get('/b2', async(req, res) => {
    db.all("SELECT * FROM fairytales WHERE class=2", (err, rows) => {
        if (err) throw err;
        res.render('gallery', {page: 2, fairyTales: rows, title: "B2 | Fairy Tales"});
    });
});

router.get('/b3', async(req, res) => {
    db.all("SELECT * FROM fairytales WHERE class=3", (err, rows) => {
        if (err) throw err;
        res.render('gallery', {page: 3, fairyTales: rows, title: "B3 | Fairy Tales"});
    });
});

router.get('/b4', async(req, res) => {
    db.all("SELECT * FROM fairytales WHERE class=4", (err, rows) => {
        if (err) throw err;
        res.render('gallery', {page: 4, fairyTales: rows, title: "B4 | Fairy Tales"});
    });
});

router.get('/fairytales', async(req, res) => {
    db.all("SELECT * FROM fairytales", (err, rows) => {
        if (err) throw err;
        res.render('gallery', {page: 5, fairyTales: rows, title: "All | Fairy Tales"});
    });
});

router.get('/fairytales/:id', async(req, res) => {
    const id = parseInt(req.params.id.replace(/[^\d.-]/g, ''));
    db.all("SELECT * FROM fairytales WHERE id=?", [id], (err, rows) => {
        if (err) throw err;
        if (!rows[0]) {
            res.status(404).send('');
        }
        if (rows[0]) {
            res.render('viewer', {fairyTale: rows[0], title: rows[0].title + " | Fairy Tales"});
        }
    });
});

router.get('/add', async(req, res) => {
    res.render('cms')
});

router.post('/add', async(req, res) => {
    const title = req.body.title;
    const classNumber = req.body.class;
    const text = req.body.text
    const image = req.body.file
    db.run("INSERT OR IGNORE INTO fairytales (title, class, text, image) VALUES (?, ?, ?, ?)", [title, classNumber, text, image])
    res.redirect('/add')
})

async function search(req, res) {
    let query = req.body.q;
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
        if (err) throw err;
        if (!query) {
            query = "Empty query!";
            rows = [];
            res.status(404)
        }
        if (!rows[0]) {
            res.status(404)
        }
        res.render('search', {page: 0, fairyTales: rows, query: query, prevSort: req.body.sort, prevFilters: [b2, b3, b4], title: query + " | Fairy Tales"});
    });
}

router.post('/search', search)
router.get('/search', search)

module.exports = router;