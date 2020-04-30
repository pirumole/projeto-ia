const { EventEmitter } = require('events');
const Options = require('./options');

class MyEvents extends EventEmitter {
    constructor() {
        super();
        this.Options = Options;
    }
}


module.exports = MyEvents;