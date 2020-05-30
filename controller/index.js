const { Router } = require('express');
var route = Router();

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

route.get('/icon/:file', (req, res) => {
    res.sendFile(path + `/public/icon/${req.params.file}`, (err) => {
        if (err) res.status(404);
        else res.status(200);
        res.end();
    });
});

route.get('*/*', (req, res) => {
    /**
     * @param adicionarPagina404
     */
    res.status(404);
    res.end();
});

route.post('/auth', async (req, res) => {
    var encryptOpt = {
        date             : new Date(),
        'local-address'  : req.socket.localAddress,
        'local-port'     : req.socket.localPort,
        'remote-address' : req.socket.remoteAddress,
        'remote-port'    : req.socket.remotePort
    };

    try {
        let cache     = await req.eventPromise('find-ip', { ra: encryptOpt['remote-address'] });
        var key       = cache.key;
        if (!key) {
            key       = await req.eventPromise('auth-user-platform', encryptOpt );
                        req.eventPromise('save-ip', { ra: encryptOpt['remote-address'], key: key });
        }

        res.json(await req.eventPromise('response-success-format', {
            message : 'authentication success',
            status  : 200,
            data    : {
                key : key
            }
        }));
        return res.end();
    } catch (error) {
        res.json(await req.eventPromise('response-error-format', {
            message : 'server error',
            status  : 500
        }));
        return res.end(200);
    }
});

module.exports = route;