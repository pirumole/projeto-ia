const Loggable = require('../util');

class Cache extends Loggable {
    cache = {};
    constructor() {
        super();
        this.on('find-ip', (data, callback) => this.findIp(data, callback));
        this.on('save-ip', (data, callback) => this.saveIp(data, callback));

        setInterval(() => {
            let date = new Date();
            for (let key in this.cache) {
                let value = this.cache[key];

                if (value['created-key'].getDate() != date.getDate() || value['created-key'].getHours() + 1 == date.getHours()) {
                    delete this.cache[key];
                }
            }
        }, 3600000);
    }

    findIp(data, callback) {
        try {
            let ricache = this.cache[data.ra];

            if (ricache) delete ricache['created-key'];
            return callback(null, ricache || {});
        } catch (error) {
            return callback(error, null);
        }
    }

    saveIp(data, callback) {
        try {
            this.cache[data.ra] = {
                'created-key': new Date(),
                'key'       : data.key
            };
            return callback(null, true);
        } catch (error) {
            return callback(error, null);
        }
    }
}

module.exports = Cache;