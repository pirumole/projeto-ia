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

route.post('/', (req, res) => {
    var date = new Date();
    var la = req.socket.localAddress;
    var lp = req.socket.localPort;
    
    var ra = req.socket.remoteAddress;
    var rp = req.socket.remotePort;
    
    req.eventPromise('find-ip', { ra: ra })
        .then(function(cache) {
            if (!cache.key) {
                Encrypt.encrypt({ 
                    value: `${date.getTime()}@${la}@${lp}@${date.toLocaleDateString()}@${rp}@${ra}@${date.getTime()}`, 
                    encoding: 'utf8', 
                    toEncoding: 'hex' 
                })
                    .then(function (encrypted) {
                        req.eventPromise('save-ip', { ra: ra, key: encrypted });
                        res.write(JSON.stringify({ key: encrypted }));
                        
                        res.status(200);
                        return res.end();
                    });
            } else {
                res.write(JSON.stringify(cache));
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