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

    buildQuery(query) {
        let _query = '?';
        let keys = Object.keys(query);

        for (let x = 0; x < keys.length; x++) {
            let key        = keys[x];
            let changedKey = '';

            if (key == 'text') {
                changedKey = 'text_input';
            }

            if (x == 0) {
                _query += `${(changedKey) ? changedKey : key}=${query[key]}`;
            } else {
                _query += `&${(changedKey) ? changedKey : key}=${query[key]}`;
            }
        }

        return _query;
    }

    getURI(data) {
        let protocol = this.process.env.IA_PROTOCOL;
        let domain   = this.process.env.IA_DOMAIN;
        let query    = this.buildQuery(data);

        return new URL(`${protocol}://${domain}${query}`);
    }

    request(data) {
        var protocol = this.process.env.IA_PROTOCOL;
        var URI = this.getURI(data);
        return new Promise((resolve, reject) => {
            var _protocol = (protocol == 'http') ? this.http : this.https; 

            var req = _protocol.request(URI, (res) => {
                let statuscode = res.statusCode;
                let header     = res.headers;
                res.setEncoding('utf8');
                var data = '';

                res.on('error', () => {
                    reject('failure in request');
                })

                res.on('data', (chunk) => {
                    if (chunk) {
                        data += chunk.toString('utf8');
                    }
                });

                res.on('end', () => {
                    resolve({ status: statuscode, headers: header, result: data });
                })
            });

            req.end();
        });
    }

    getArrayInfo(array = []) {
        let initialLen = 0;
        let finalLen   = array.length;

        return {
            initialLen,
            finalLen,
            array: array
        };
    }

    handleText(data = { text: '' }) {
        let textArray = data.text.split(' ').filter((a) => { if (a) return a; });
        let _info = this.getArrayInfo(textArray);
        var _text = '';
        let len = 0;

        if (_info.finalLen >= 6) {
            len = _info.finalLen - 6;
        }

        for (let x = len; x < _info.finalLen; x++) {
            if (x == _info.finalLen - 1)
                _text += _info.array[x];
            else
                _text += _info.array[x] + ' ';
        }

        return data;
    }

    convertJson(response = { status : 0, result : '' }) {
        let _result = null;
        if (response.status == 200) {
            try {
                _result = response.result.replace(/\[|\]|\"|\'|\n|\r|\s/g, '').split(',');
            } catch (error) {
            }
        };

        return _result;
    }

    async sendMessageToIa(data) {
        delete data.auth;
        data = this.handleText(data);
        let response = await this.request(data);
        return { options: this.convertJson(response) };
    }
}

module.exports = Core;