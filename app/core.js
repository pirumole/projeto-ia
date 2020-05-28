const Config = require('../configs');

class Core extends Config {
    constructor() {
        super();
        this.on('auth-user-platform', this.authUser);
    }

    async authUser(option, callback) {
        let _opt = {
            encoding  : 'utf8',
            _encoding : 'hex'
        }

        let value = `${option.date.getTime()}`     +
                    `@${option['local-address']}`  +
                    `@${option['local-port']}`     +
                    `@${option.id}`                +
                    `@${option['remote-port']}`    +
                    `@${option['remote-address']}` +
                    `@${option.date.getTime()}`    ;

        try {
            let encrypted = await this.encrypt({ value: value, encoding: _opt.encoding, _encoding: _opt._encoding });
            callback(null, encrypted);
        } catch (error) {
            callback(error, null);            
        }
    }

    async sendMessageToIa(data) {
        return { options: ['text texto bastantemente grande, grande de mais 01', 'text 02', 'text 03'] };
    }
}

module.exports = Core;