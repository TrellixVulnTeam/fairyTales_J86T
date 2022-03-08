const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const api = express();
const path = require('path');

let db = new sqlite3.Database('./db/fairytales.db', (err) => {
  if (err) {
    throw err;
  }
  db.run("CREATE TABLE IF NOT EXISTS fairytales(id INTEGER PRIMARY KEY, class INTEGER NOT NULL CHECK (class=2 OR class=3 OR class=4), title TEXT NOT NULL, textPath TEXT NOT NULL UNIQUE, imgPath TEXT NOT NULL UNIQUE)");
  console.log('Connected to the database.');
});


api.listen(80, () => {
  console.log('API up and running!');
});

api.use(express.static(__dirname));
api.set('views', 'resources/frontend/views');
api.set('view engine', 'pug')


api.get('/', async(req, res) => {
  res.render('home');
});

api.get('/b2', async(req, res) => {
  const fairytales = await new Promise((resolve,reject) => {
    db.all("SELECT * FROM fairytales WHERE class=2", (err, rows) => {
      if (err) throw err;
        res.render('gallery', {page: 2, fairyTales: rows});
     });
    });
});

api.get('/b3', async(req, res) => {
  const fairytales = await new Promise((resolve,reject) => {
    db.all("SELECT * FROM fairytales WHERE class=3", (err, rows) => {
      if (err) throw err;
        res.render('gallery', {page: 3, fairyTales: rows});
     });
    });
});

api.get('/b4', async(req, res) => {
  const fairytales = await new Promise((resolve,reject) => {
    db.all("SELECT * FROM fairytales WHERE class=4", (err, rows) => {
       if (err) throw err;
       res.render('gallery', {page: 4, fairyTales: rows});
     });
    });
});

api.get('/fairytales', async(req, res) => {
  const fairytales = await new Promise((resolve,reject) => {
    db.all("SELECT * FROM fairytales", (err, rows) => {
       if (err) throw err;
       resolve(rows);
     });
    });
  res.json(fairytales);
});

api.get('/fairytales/:id', async(req, res) => {
  const id = parseInt(req.params.id.replace(/[^\d.-]/g, ''));
  const fairytales = await new Promise((resolve,reject) => {
    db.all("SELECT * FROM fairytales WHERE id=?", [id], (err, rows) => {
       if (err) throw err;
       resolve(rows);
     });
    });
  res.json(fairytales);
});