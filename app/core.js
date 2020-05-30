const Config = require('../configs');

class Core extends Config {
    constructor() {
        super();
        this.on('auth-user-platform', this.authUser);
    }

    getEndDate(date = new Date) {
        let _opt = {
            year    : date.getFullYear() ,
            month   : date.getMonth() + 1,
            day     : date.getDate()     ,
            hour    : date.getHours()    ,
            minute  : date.getMinutes()  ,
            seccond : date.getSeconds()
        };

        let _date = new Date(
            `${_opt.year}-`     +
            `${_opt.month}-`    +
            `${_opt.day} `      +
            `${_opt.hour + 1}:` +
            `${_opt.minute}:`   +
            `${_opt.seccond}`
        );

        return _date.getTime();
    }

    async authUser(option, callback) {
        let _opt = {
            encoding  : 'utf8',
            _encoding : 'hex'
        }

        let value = `${option.date.getTime()}`            +
                    `@${option['local-address']}`         +
                    `@${option['local-port']}`            +
                    `@${option.date.toLocaleString()}`    +
                    `@${option['remote-port']}`           +
                    `@${option['remote-address']}`        +
                    `@${this.getEndDate(option.date)}`    ;

        try {
            let encrypted = await this.encrypt({ value: value, encoding: _opt.encoding, _encoding: _opt._encoding });
            callback(null, encrypted);
        } catch (error) {
            callback(error, null);            
        }
    }

    getMetadata(decrypted) {
        decrypted = decrypted.split('@');

        return {
            'first-timestamp' : parseInt(decrypted[0]),
            'local-address'   : decrypted[1],
            'local-port'      : decrypted[2],
            'date-string'     : decrypted[3],
            'remote-port'     : decrypted[4],
            'remote-address'  : decrypted[5],
            'last-timestamp'  : parseInt(decrypted[6]),
            'final-date'      : new Date(parseInt(decrypted[6])),
            'current-date'    : new Date()
        };
    }

    async validateUser(data) {
        try {
            let decrypted    = await this.decrypt({ value: data, encoding: 'utf8', _encoding: 'hex' });
            let __metadata__ = this.getMetadata(decrypted);

            if (__metadata__["final-date"] > __metadata__["current-date"])
                return true;
            else
                return false;
        } catch (error) {
            return false;
        }
    }

    async sendMessageToIa(data) {
        return { options: ['text texto bastantemente grande, grande de mais 01', 'text 02', 'text 03'] };
    }
}

module.exports = Core;