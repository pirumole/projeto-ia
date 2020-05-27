const { Router } = require('express');
const fs = require('fs');
var route = Router();
const EncryptClass = require('../util/crypt');
const Encrypt = new EncryptClass();

let path = __dirname.replace('/controller', '');

route.get('/', (req, res) => {
    res.sendFile(path + '/public/html/index.html', (err) => {
        if (err) res.status(404);
        else res.status(200);
        res.end();
    });
});

route.get('/js/:file', (req, res) => {
    res.sendFile(path + `/public/js/${req.params.file}`, (err) => {
        if (err) res.status(404);
        else res.status(200);
        res.end();
    });
});

route.get('/css/:file', (req, res) => {
    res.sendFile(path + `/public/css/${req.params.file}`, (err) => {
        if (err) res.status(404);
        else res.status(200);
        res.end();
    });
});

route.get('*/*', (req, res) => {
    res.status(404);
    res.end();
});

route.post('/text', (req, res) => {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.status(200);
    return res.end();
});

route.post('/auth', (req, res) => {
    res.writeHead(200, {'Content-Type': 'application/json'});
    
    if (!req.body.id) {
        res.writeJson({ status: 'error', message: 'data is missing', 'status-code': 200 });
        res.status(400);
        return res.end();
    }

    var date = new Date();
    var la = req.socket.localAddress;
    var lp = req.socket.localPort;
    
    var ra = req.socket.remoteAddress;
    var rp = req.socket.remotePort;
    
    req.eventPromise('find-ip', { ra: ra })
        .then(function(cache) {
            if (!cache.key) {
                Encrypt.encrypt({ 
                    value: `${date.getTime()}@${la}@${lp}@${req.body.id}@${rp}@${ra}@${date.getTime()}`, 
                    encoding: 'utf8', 
                    toEncoding: 'hex' 
                })
                    .then(function (encrypted) {
                        req.eventPromise('save-ip', { ra: ra, key: encrypted });
                        res.writeJson({ status: 'success', message: 'authentication is success', key: encrypted, 'status-code': 200 });
                        
                        res.status(200);
                        return res.end();
                    });
            } else {
                res.writeJson({ status: 'success', message: 'authentication is success', key: cache.key, 'status-code': 200 });
                res.status(200);
                return res.end();
            }
        })
        .catch(function (error) {
            res.status(500);
            return res.end();
        });
});

module.exports = route;