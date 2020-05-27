class EncryptOption {
    value      = null;
    encoding   = '';
    toEncoding = '';

    encodings  = ["ascii", "utf8", "utf-8", "utf16le", "ucs2", "ucs-2", "base64", "latin1", "binary", "hex"];

    constructor(value, encoding, toEncoding) {
        if (value && encoding && toEncoding) {
            if (!this.inArray(encoding, this.getEncodings()))   throw 'encoding not suported';
            if (!this.inArray(toEncoding, this.getEncodings())) throw 'toEncoding not suported';
    
            this.encoding   = encoding;
            this.toEncoding = toEncoding;
            this.value      = value;
        }
    }

    inArray(value, array = []) {
        let index = array.indexOf(value);
        return index >= 0;
    }

    getValue() {
        return this.value;
    }

    getEncodings() {
        return this.encodings;
    }
}

class DecryptOption {
    value      = null;
    encoding   = '';
    toEncoding = '';

    encodings  = ["ascii", "utf8", "utf-8", "utf16le", "ucs2", "ucs-2", "base64", "latin1", "binary", "hex"];

    constructor(value, encoding, toEncoding) {
        if (value && encoding && toEncoding) {
            if (!this.inArray(encoding, this.getEncodings()))   throw 'encoding not suported';
            if (!this.inArray(toEncoding, this.getEncodings())) throw 'toEncoding not suported';
    
            this.encoding   = encoding;
            this.toEncoding = toEncoding;
            this.value      = value;
        }
    }

    inArray(value, array = []) {
        let index = array.indexOf(value);
        return index >= 0;
    }

    getValue() {
        return this.value;
    }

    getEncodings() {
        return this.encodings;
    }
}

class CryptDepends {
    crypto    = require('crypto');
    algorithm = 'aes-192-cbc';
    encoding  = 'sha256';
    iv        = Buffer.alloc(16, 0); 
    salt      = 'salt';
    saltRange = 24;
    passrange = 100;
    character = {
        latter: 'abcdefghijklmnopqrstuvxywz',
        number: '0123456789',
        super : '!@#$%*()_+=-¬¢¹§ªº:;?/°|[]{}`´~^'
    };
    pass      = '';
    key       = null;

    constructor() {
        this.setPassword();
    }

    getObjectKeys(object) {
        return Object.keys(object);
    }

    getObjectValues(object) {
        return Object.values(object);
    }

    getObjectValue(field, object) {
        return {
            original: object,
            field   : field,
            keys    : this.getObjectKeys(object),
            values  : this.getObjectValues(object),
            value   : object[field]
        };
    }

    getInfoArraY(array = []) {
       return {
           min: 0,
           max: (array.length) ? array.length -1 : 0
       };
    }

    getStringValue(index, string) {
        // console.log(index, string);
        return 'a';
    }

    getArrayValue(index, array) {
        let info = this.getInfoArraY(array);
        if (index < info.min) index = 0;
        if (index > info.max) index = info.max;

        return {
            index: index,
            value: array[index],
            min  : info.min,
            max  : info.max
        };
    }

    getRandomNumber(min, max) {
        let houseDecimal = 10;

        if (min > max) {
            let _min = min;
            min = max;
            max = _min;
        }

        while(max > houseDecimal) {
            houseDecimal *= 10;
        }

        let randomValue;
        do {
            randomValue = Math.random() * houseDecimal;
            randomValue = Math.floor(randomValue);
        } while (randomValue < min  || randomValue > max);

        return randomValue;
    }

    randomText(range = 0) {
        let randText      = '';
        let keys          = this.getObjectKeys(this.character);

        if (!range || typeof range !== 'number') return randText; 
        for(let x = 0; x < range; x++) {
            let infoKeysArray  = this.getInfoArraY(keys);
            let keyIndex       = this.getRandomNumber(infoKeysArray.min, infoKeysArray.max);
            let keyOption      = this.getArrayValue(keyIndex, keys);
            let valueObject    = this.getObjectValue(keyOption.value, this.character);
            let infoValue      = this.getInfoArraY(valueObject.value);
            let valueIndex     = this.getRandomNumber(infoValue.min, infoValue.max);
            let value          = this.getArrayValue(valueIndex, valueObject.value);
            randText          += value.value; 
        }

        return randText;
    }

    setPassword() {
        this.pass = this.randomText(this.passrange);
    }
}

class Crypt extends CryptDepends {
    constructor() {
        super();
        this.setKey();
    }

    async setKey() {
        this.key = await this.crypto.scryptSync(
            this.pass,
            this.salt,
            this.saltRange
        );
    }

    async getEncrypt() {
        return await this.crypto.createCipheriv(
            this.algorithm,
            this.key,
            this.iv
        );
    }

    async getDecrypt() {
        return await this.crypto.createDecipheriv(
            this.algorithm,
            this.key,
            this.iv
        );
    }

    async encrypt(option = new EncryptOption) {
        new EncryptOption(option.value, option.encoding, option.toEncoding);
        let encrypt = await this.getEncrypt();

        let encrypted     = '';

        encrypted        += encrypt.update(option.value, option.encoding, option.toEncoding);
        encrypted        += encrypt.final(option.toEncoding);

        return encrypted;
    }

    async decrypt(option = new DecryptOption) {
        new DecryptOption(option.value, option.toEncoding, option.encoding);
        let decrypt = await this.getDecrypt();

        let decrypted     = '';

        decrypted        += decrypt.update(option.value, option.toEncoding, option.encoding);
        decrypted        += decrypt.final(option.encoding);

        return decrypted;
    }
}

module.exports = Crypt;