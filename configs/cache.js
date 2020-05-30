const Loggable = require('../util');

class Cache extends Loggable {
    cache = {};
    constructor() {
        super();
        this.on('find-ip', (data, callback) => this.findIp(data, callback));
        this.on('save-ip', (data, callback) => this.saveIp(data, callback));

        setInterval(() => {
            this.cache = {};
        }, this.getMillisecondsToHour(this.getHourEnv()));
    }

    getHourEnv() {
        let hour = parseInt(this.process.env.CLEAR_CACHE_HOUR) || 1;
        return hour;
    }

    getMillisecondsToHour(hour = 0) {
        let minutes       = hour     * 60;
        let secconds      = minutes  * 60; 
        let millesecconds = secconds * 1000;
        return millesecconds;
    }

    getIp(value) {
        let exec = /\d*\.\d*\.\d*\.\d*/g.exec(value);
        return exec[0];
    }

    findIp(data, callback) {
        try {
            data.ra = this.getIp(data.ra);
            let ricache = this.cache[data.ra];

            if (ricache) delete ricache['created-key'];
            return callback(null, ricache || {});
        } catch (error) {
            return callback(error, null);
        }
    }

    saveIp(data, callback) {
        try {
            data.ra = this.getIp(data.ra);
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