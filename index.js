const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const db = require('./db/db.js')
const main = require('./resources/routes/main.js');
const api = require('./resources/routes/api.js');


app.listen(80, () => {
  console.log('API up and running!');
});

app.use('/stylesheets', express.static(__dirname + '/resources/frontend/stylesheets'));
app.set('views', 'resources/frontend/views');
app.set('view engine', 'pug')
app.use(express.urlencoded({limit: '10mb',extended: true}));
app.use('/', main);
app.use('/api', api);
