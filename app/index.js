const Api = require('../api');

class App extends Api {
    constructor() {
        super();
    }

    async serverListen() {
        this.socketio(this.protocol);
        this.protocol.listen(this.procotolOption, () => this.log({
            message: `server open in ${this.protocolName}://${this.procotolOption.host}:${this.procotolOption.port}/`
        }));
    }
}

module.exports = App;