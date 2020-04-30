class Option {
    constructor() {
        this.color = new String() || null;
        this.delay = {
            lastLog: new Number(),
            afterLog: new Number()
        } || null;
        this.time = new Date() || null;
        this.message = new String();
    }
}

module.exports = new Option;