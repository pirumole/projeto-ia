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
                xmlHttp.timeout = 4000;
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
        this.document                 = document;
        this.window                   = window;
        this.main                     = this.document.getElementById(this.mainId);
        this.mainColor                = "#ffffff";
        this.text                     = this.document.getElementById(this.textId);
        this.textResize               = "none";
        this.intervalTimeTextValidate = 1;
        this.key                      = '';
        this.id                       = '';
        this.idLen                    = 100;
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
        return { innerWidth: innerWidth, innerHeight: innerHeight };
    }

    getOffSet(div) {
        let { offsetWidth, offsetHeight } = div;
        return { offsetWidth: offsetWidth, offsetHeight: offsetHeight }
    }

    render() {
        let OffSetMain = this.getWindowInnerOffSet();
        this.main.style.width = `${(OffSetMain.innerWidth * 0.9)}px`;
        this.main.style.height = `${(OffSetMain.innerHeight)}px`;
        this.main.style.backgroundColor = this.mainColor;
        this.main.style.margin = "auto";

        let OffSetText = this.getOffSet(this.main);
        this.text.style.width = `${OffSetText.offsetWidth}px`;
        this.text.style.height = `${OffSetText.offsetHeight * 0.99 + 4}px`;
        this.text.style.resize = this.textResize;
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

    async sendText() {
        let request = new NativeRequest('POST', '/text');
        await request.sendJSON({ text: this.getValueText() }, this.getAuth());
        let jsonResponse = request.getData();
    }

    async onTextChangeSync() {
        let lastLen = this.getTextLength();

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
        let request = new NativeRequest('POST', '/auth');
        await request.sendJSON({ id: this.id });
        let jsonResponse = request.getData();
        this.key = jsonResponse.key;
    }
    
    async listen() {
        await this.auth();
        this.render();
    }
}

window.onload = () => (new Main).listen();