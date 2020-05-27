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
            next(); 
        });
        this.express.use(require('../controller'));
        this.protocol.listen({ port: this.procotolOption.port }, () => this.log({
            message: `server open in ${this.protocolName}://${this.procotolOption.host}:${this.procotolOption.port}/`
        }));
    }
}

module.exports = App;