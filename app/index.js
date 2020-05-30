const Api = require('../api');

class App extends Api {
    constructor() {
        super();
        this.on('response-error-format', (data, callback) => this.errorFormat(data, callback));
        this.on('response-success-format', (data, callback) => this.successFormat(data, callback));
    }

    errorFormat(_opt, callback) {
        let date = new Date();

        callback(null, {
            status    : 'error',
            timestamp : date.getTime(),
            code      : _opt.status,
            message   : _opt.message,
            result    : _opt.data || {}
        });
    }

    successFormat(_opt, callback) {
        let date = new Date();

        callback(null, {
            status    : 'success',
            timestamp : date.getTime(),
            code      : _opt.status,
            message   : _opt.message,
            result    : _opt.data || {}
        });
    }

    eventPromise(eventName, eventData) {
        return new Promise((resolve, reject) => {
            this.emit(eventName, eventData, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    async ioListen() {
        this.socketio.on('connect', async (socket) => {
            socket.on('message', async (data, callback) => {
                try {
                    let cache = await this.eventPromise('find-ip', { ra: socket.client.conn.remoteAddress });
                    if (cache && data.auth && cache.key && cache.key == data.auth)
                        if (await this.validateUser(data.auth)) {
                            let response = await this.sendMessageToIa(data);
                            callback(null, await this.eventPromise('response-success-format', {
                                message: 'ia response success',
                                code: 200,
                                data: response
                            }));
                        }

                    callback(null, await this.eventPromise('response-error-format', {
                        message: 'unauthenticated user',
                        code: 200,
                        data: {
                            autentication: false
                        }
                    }));
                } catch (error) {
                    callback(await this.eventPromise('response-error-format', {
                        message: 'error response ia',
                        code: 200
                    }), null);
                }
            });
            socket.on('disconnect', () => {
                this.emit('clear-user-cache', socket);
            })
        });
    }

    middleware(req, res, next) {
        // Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin', '*');

        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', '*');

        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader('Access-Control-Allow-Credentials', false);

        req.eventPromise = async (eventName, eventData) => {
            return await this.eventPromise(eventName, eventData);
        };

        res.writeJson = function (object) {
            res.write(JSON.stringify(object));
        };

        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString('utf8');
        });

        req.on('end', () => {
            try {
                req.body = JSON.parse(body);
            } catch (error) {
                req.body = {};
            }

            try {
                for(let key in req.headers) 
                    if (key == 'authorization') req.body.authorization = req.headers[key].replace(/Bearer\s/g, '');
            } catch (error) {}

            next();
        });
    }

    async serverListen() {
        this.socketio = this.socketio(this.protocol);
        this.express.use((req, res, next) => this.middleware(req, res, next));
        this.express.use(require('../controller'));
        this.protocol.listen({ port: this.procotolOption.port }, () => this.log({
            message: `server open in ${this.protocolName}://${this.procotolOption.host}:${this.procotolOption.port}/`
        }));
        this.ioListen();
    }
}

module.exports = App;