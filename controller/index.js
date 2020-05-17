const { Router } = require('express');
const fs = require('fs');
var route = Router();

let path = __dirname.replace('\\controller', '');

route.get('/', (req, res) => {
    res.sendFile(path + '\\public\\html\\index.html', (err) => {
        if (err) res.status(404);
        else res.status(200);
        res.end();
    });
});

route.get('/js/:file', (req, res) => {
    res.sendFile(path + `\\public\\js\\${req.params.file}`, (err) => {
        if (err) res.status(404);
        else res.status(200);
        res.end();
    });
});

route.get('/css/:file', (req, res) => {
    res.sendFile(path + `\\public\\css\\${req.params.file}`, (err) => {
        if (err) res.status(404);
        else res.status(200);
        res.end();
    });
});

route.get('*/*', (req, res) => {
    res.status(404);
    res.end();
});

module.exports = route;