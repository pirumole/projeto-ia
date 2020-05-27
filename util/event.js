const { EventEmitter } = require('events');
const Options = require('./options');

class MyEvents extends EventEmitter {
    constructor() {
        super();
        this.Options = Options;
        this.crypt   = new require('./crypt');
    }
}


module.exports = MyEvents;