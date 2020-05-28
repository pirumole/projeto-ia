const Crypto  = require('./crypt');

class Util extends Crypto {
    constructor() {
        super();
        this.fs = require('fs');
        this.os = require('os');
        this.process = require('process');
        this.net = require('net');
        this.http = require('http');
        this.https = require('https');
        this.expressModule = require('express');
        this.socketio = require('socket.io');
        this.express = this.expressModule();
    }

    async dirExists(option = this.Options.DirExistsOption) {
        try {
            await this.fs.readdirSync(option._dirname_);
            return true;
        } catch (error) {
            return false;
        }
    }

    async fileExistsInDir(option = this.Options.FileExistsInDirOption) {
        let dir = this.fs.readdirSync(option._dirname_);
        return dir.indexOf(option._file_) >= 0;
    }
}

module.exports = Util;