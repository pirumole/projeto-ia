const Api = require('../api');

class App extends Api {
    constructor() {
        super();
    }

    eventPromise(eventName, eventData) {
        return new Promise((resolve, reject) => {
            this.emit(eventName, eventData, (err, data) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(data);
                }
            });
        });
    }

    async serverListen() {
        this.socketio(this.protocol);
        this.express.use((req, res, next) => {
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

                for(let key in req.headers) 
                    if (key == 'authorization') req.body.authorization = req.headers[key].replace(/Bearer\s/g, '');

                next(); 
            });
        });
        this.express.use(require('../controller'));
        this.protocol.listen({ port: this.procotolOption.port }, () => this.log({
            message: `server open in ${this.protocolName}://${this.procotolOption.host}:${this.procotolOption.port}/`
        }));
    }
}

module.exports = App;