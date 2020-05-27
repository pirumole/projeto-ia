const Api = require('../api');

class App extends Api {
    constructor() {
        super();
    }

    async serverListen() {
        this.socketio(this.protocol);
        this.express.use(require('../controller'));
        this.protocol.listen({ port: this.procotolOption.port }, () => this.log({
            message: `server open in ${this.protocolName}://${this.procotolOption.host}:${this.procotolOption.port}/`
        }));
    }
}

module.exports = App;