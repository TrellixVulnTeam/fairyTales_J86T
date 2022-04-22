const express = require('express');
const db = require.main.require('./db/db.js');
const sqlite3 = require('sqlite3').verbose();

router = express.Router();

router.get('/', async(req, res) => {
    res.render('home');
})
  
router.get('/b2', async(req, res) => {
    db.all("SELECT * FROM fairytales WHERE class=2", (err, rows) => {
        if (err) throw err;
        res.render('gallery', {page: 2, fairyTales: rows});
    });
});

router.get('/b3', async(req, res) => {
    db.all("SELECT * FROM fairytales WHERE class=3", (err, rows) => {
        if (err) throw err;
        res.render('gallery', {page: 3, fairyTales: rows});
    });
});

router.get('/b4', async(req, res) => {
    db.all("SELECT * FROM fairytales WHERE class=4", (err, rows) => {
        if (err) throw err;
        res.render('gallery', {page: 4, fairyTales: rows});
    });
});

router.get('/fairytales', async(req, res) => {
    db.all("SELECT * FROM fairytales", (err, rows) => {
        if (err) throw err;
        res.render('gallery', {page: 5, fairyTales: rows});
    });
});

router.get('/fairytales/:id', async(req, res) => {
    const id = parseInt(req.params.id.replace(/[^\d.-]/g, ''));
    db.all("SELECT * FROM fairytales WHERE id=?", [id], (err, rows) => {
        if (err) throw err;
        res.render('viewer', {fairyTales: rows});
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

router.post('/search', async(req, res) => {
    const query = req.body.q;
    if (!query) {
        res.render('gallery', {page: 0, fairyTales: []});
    }
    db.all("SELECT * FROM fairytales WHERE title LIKE ?", ['%' + query + '%'], (err, rows) => {
        if (err) throw err;
        res.render('gallery', {page: 0, fairyTales: rows});
    });
});

module.exports = router;