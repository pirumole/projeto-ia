const Cache = require('./cache');

class Config extends Cache {
    constructor() {
        super();
        this.protocol;
        this.protocolName = "";
        this.procotolOption = {
            host: '',
            port: ''
        };
    }

    validatePort(port, address) {
        return new Promise((resolver) => {
            let server = this.net.createServer((socket) => {});
    
            server.listen(port, address);

            server.on('error', () => {
                return resolver(false);
            });

            server.on('listening', () => {
                server.close();
                return resolver(true);
            });
        });
    }

    async getPort(port, host) {
        if (await this.validatePort(port, host))
            return port;
        return await this.getPort(port + 1, host);
    }

    async getSSLKeyAndCert() {
        let dirFiles = await this.fs.readdirSync(__dirname + '/ssl');
        let key, cert;

        dirFiles.forEach((file) => {
            if (/\w*[cCeErRtT]\.pem/.test(file)) cert = this.fs.readFileSync(__dirname + `/ssl/${file}`);
            if (/\w*[kKeEyY]\.pem/.test(file)) file = this.fs.readFileSync(__dirname + `/ssl/${file}`);
        });

        return {
            key: key,
            cert: cert
        };
    }

    async getEnvProtocol() {
        let host = this.process.env.SERVER_HOSTNAME;
        let port = this.process.env.SERVER_PORT;

        if (!host) {
            let interfaces = this.os.networkInterfaces();
            let interfaceNames = Object.keys(interfaces);
            let globalInterface = interfaces['wlp8s0'] || interfaces['eth0'] || '127.0.0.1';

            if (globalInterface != '127.0.0.1') {
                if (/\d*\.\d*\.\d*\.\d*/g.test(     globalInterface[0].address))      host = globalInterface[0].address;
                else if (/\d*\.\d*\.\d*\.\d*/g.test(globalInterface[1].address))      host = globalInterface[1].address
                else                                                                  host = '127.0.0.1';
            }
        }
        if (!port) {
            port = await this.getPort(3000, host);
        }

        this.procotolOption.host = host;
        this.procotolOption.port = port;
    }

    async setConfig() {
        await this.getEnvProtocol();

        if (await this.dirExists(__dirname + '/ssl')) {
            let ssl = await this.getSSLKeyAndCert();

            if (ssl.key && ssl.cert) {
                this.protocolName = 'https';
                this.protocol = this.https.createServer(ssl, this.express);
                return true;
            }
        }

        this.protocolName = 'http';
        this.protocol = this.http.createServer(this.express);

        return true;
    }
}

module.exports = Config;