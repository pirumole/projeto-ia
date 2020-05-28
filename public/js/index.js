class NativeRequest {
    method;
    url;
    data;
    responseData;

    constructor(method, url) {
        this.method = method;
        this.url    = url;
    }

    getData() {
        return this.responseData;
    }

    toJson() {
        return JSON.parse(this.responseData);
    }

    sendJSON(data, auth) {
        return new Promise((resolve, reject) => {
            try {
                if (typeof data !== 'object' && data.length) throw 'type dont\'t supported';

                let xmlHttp = new XMLHttpRequest();
                xmlHttp.timeout = 12000;
                xmlHttp.responseType = 'json';

                xmlHttp.onerror = () => {
                    reject('Request Failed');
                }

                xmlHttp.onloadend = () => {
                    this.responseData = xmlHttp.response;
                    return resolve(true);
                };

                xmlHttp.open(this.method, this.url, true);
                xmlHttp.setRequestHeader('Content-type', 'application/json');
                if (auth) xmlHttp.setRequestHeader('Authorization', auth);
                xmlHttp.send(JSON.stringify(data));
            } catch (error) {
                reject(error);
            }
        });
    }
}

class Repository {
    constructor() {
        this.mainId                   = "main";
        this.textId                   = "text";
        this.optionsId                = "options";
        this.mainColor                = "#ffffff";
        this.textResize               = "none";
        this.window                   = window;
        this.document                 = this.window.document;
        this.body                     = this.document.body;
        this.main                     = this.document.getElementById(this.mainId) ;
        this.text                     = this.document.getElementById(this.textId) ;
        this.options                  = this.document.getElementById(this.optionsId);
        this.onOption                 = false;
        this.intervalTimeTextValidate = 1;
        this.key                      = '';
        this.id                       = '';
        this.idLen                    = 100;
        this.socket                   = io();
        this.margin                   = 0;
    }
}

class Util extends Repository {
    character = {
        latter: 'abcdefghijklmnopqrstuvxywz',
        number: '0123456789',
        super : '!@#$%*()_+=-¬¢¹§ªº:;?/°|[]{}`´~^'
    };

    constructor() {
        super();
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
    
}

class Controller extends Util {
    constructor() { super(); }

    getWindowInnerOffSet() {
        let { innerWidth, innerHeight } = this.window;

        let bodyWidth  = innerWidth     ;
        let bodyHeight = innerHeight - 4;


        if (bodyWidth   < 500) bodyWidth   = 500;
        if (bodyHeight  < 500) bodyHeight  = 500;

        let mainWidth  = Math.floor(bodyWidth - 180);
        let mainHeight = bodyHeight;

        let mainMarginLeft  = Math.floor(bodyWidth - mainWidth) / 2;
        let mainMarginRight = Math.floor(bodyWidth - mainWidth) / 2;

        if (this.onOption) {
            mainMarginLeft  = 0;
            mainMarginRight = 4;
        }

        return {
            innerWidth      : innerWidth, 
            innerHeight     : innerHeight, 
            bodyWidth       : bodyWidth,
            bodyHeight      : bodyHeight,
            mainWidth       : mainWidth,
            mainHeight      : mainHeight,
            mainMarginLeft  : mainMarginLeft,
            mainMarginRight : mainMarginRight,
            textWidth       : mainWidth  - 2,
            textHeight      : mainHeight - 2,
            optionWidth     : bodyWidth - mainWidth
        };
    }

    getOffSet(div) {
        let { offsetWidth, offsetHeight } = div;
        return { offsetWidth: offsetWidth, offsetHeight: offsetHeight }
    }

    render() {
        let OffSetMain                     = this.getWindowInnerOffSet()      ;

        this.body.style.width              = `${OffSetMain.bodyWidth}px`      ;
        this.body.style.height             = `${OffSetMain.bodyHeight}px`     ;

        this.main.style.width              = `${OffSetMain.mainWidth}px`      ;
        this.main.style.height             = `${OffSetMain.mainHeight}px`     ;
        this.main.style.marginLeft         = `${OffSetMain.mainMarginLeft}px` ;
        this.main.style.marginRight        = `${OffSetMain.mainMarginRight}px`;
        this.main.style.backgroundColor    = this.mainColor                   ;
        
        this.text.style.width              = `${OffSetMain.textWidth}px`      ;
        this.text.style.height             = `${OffSetMain.textHeight}px`     ;
        this.text.style.margin             = 'auto';
        this.text.style.resize             = this.textResize;
    }

    getText() {
        return this.main.innerText;
    }

    getKeyEvent(event) {
        let { keyCode, key, shiftKey, ctrlKey } = event;
        return { keyCode: keyCode, key: key, shiftKey: shiftKey, ctrlKey: ctrlKey };
    }

    getTextLength(text = "") {
        if (!text) {
            text = this.getValueText();
        }

        return text.length;
    }

    getValueText() {
        return this.text.value;
    }

    getTimeFloat(time) {
        return (parseFloat(time) || 0.5) * 1000;
    }

    getAuth() {
        return 'Bearer ' + this.key;
    }

    ioPromise(socketemitter, data) {
        return new Promise((resolve, reject) => {
            this.socket.emit(socketemitter, data, (err, data) => {
                if (err) return reject(err);
                return resolve(data);
            });
        })
    }

    async renderErrorModal(error) {
        let _errMessage = '';

        if (typeof error == 'string') {
            _errMessage = error;
        } else if (typeof error == 'object') {
            _errMessage = error.message;
        } else {
            _errMessage = 'unidentified error'
        }

        console.error(_errMessage);
    }

    sleep(time) {
        time = parseFloat(time) || 1;
        time *= 1000;

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, time);
        });
    }

    async removeButtons(div) {
        if (div) {
            const text = div.innerText;
            this.text.value += ` ${text} `;
        } 
        this.onOption = false;

        while(this.options.firstChild) {
            this.options.removeChild(this.options.lastChild);
        }

        this.options.style.width  = "0px";
        this.options.style.height = "0px";
        this.body.style.display   = "block";
        this.render();
        this.text.focus();
    }

    async renderButtonOptions(options) {
        this.onOption  = true;
        this.render();
        let offsetMain = this.getWindowInnerOffSet();

        this.body.style.display            = 'flex';
        this.options.style.backgroundColor = '#aaaaa';

        this.options.style.width           = `${offsetMain.optionWidth - 5}px`;
        this.options.style.height          = `${offsetMain.bodyHeight}px`;
        this.options.style.overflow        = 'auto';
        for (let i in options) {
            let option = options[i];
            let button = this.document.createElement('div');

            button.style.width             = `${offsetMain.optionWidth * 0.8 }px`;
            button.classList.add('option-button');
            button.innerText               = option;
            button.onclick                 = () => this.removeButtons(button);

            this.options.appendChild(button);
        }
    }

    async sendText() {
        try {
            let res = await this.ioPromise('message', { text: this.getValueText(), auth: this.getAuth() });
            if (!res.result)                 throw "no result";
            if (!res.result.options)         throw "no options";
            if (!res.result.options.length)  throw "no options len";

            this.renderButtonOptions(res.result.options);
        } catch (error) {
            this.renderErrorModal(error);
        }
    }

    async onTextChangeSync() {
        let lastLen = this.getTextLength();
        if (this.onOption) this.removeButtons(null);

        if (!lastLen) return true;
        setTimeout(async () => {
            let newLen = this.getTextLength();

            if (lastLen == newLen) {
                await this.sendText();
            }
        }, this.getTimeFloat(this.intervalTimeTextValidate));
    }
}

class Events extends Controller {
    constructor() {
        super();
        this.window.onkeydown = (event) => this.onkeydownSync(event);
        this.window.onresize = (event) => this.render();
        this.text.oninput = (event) => this.onTextChangeSync();
    }

    async onkeydownSync(event) {
        let eventKey = this.getKeyEvent(event);
        if (eventKey.ctrlKey && eventKey.keyCode == 83) {
            event.preventDefault();
        }

        return true;
    }

    async onkeypressSync(event) {
        this.onTextChangeSync();
    }
}

class Main extends Events {
    constructor() { 
        super();
        this.setId();
    }
    
    setId() {
        this.id = this.randomText(this.idLen);
    }

    async auth() {
        try {
            let request = new NativeRequest('POST', '/auth');
            await request.sendJSON({ id: this.id });
            let jsonResponse = request.getData();
            if (jsonResponse) {
                if (jsonResponse.key)
                    this.key = jsonResponse.key;
            } else {
                throw { message: 'unable to authenticate' }
            }
        } catch (error) {
            this.renderErrorModal(error);      
        }
    }
    
    async listen() {
        this.auth();
        this.render();
    }
}

window.onload = () => (new Main).listen();