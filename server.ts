"use strict";
import * as express from "express";
const app = express();

app.use(express.static(__dirname + '/src'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));

app.get('/task/list', (req, res) => {
    res.end(JSON.stringify({ operationOK: true, message: 'task list here' }));
});

app.use(function(req, res) {
    // Use res.sendfile, as it streams instead of reading the file into memory.
    res.sendFile(__dirname + '/src/index.html');
});

const server = app.listen(8081, () => {
    console.log('Server running at http://127.0.0.1:8081/');
});