class Repository {
    constructor() {
        this.mainId = "main";
        this.textId = "text";
        this.document = document;
        this.window = window;
        this.main = this.document.getElementById(this.mainId);
        this.mainColor = "#ffffff";
        this.text = this.document.getElementById(this.textId);
        this.textResize = "none";
        this.intervalTimeTextValidate = 1;
    }
}

class NativeRequest {
    method;
    url;
    data;
    responseData;

    constructor(method, url) {
        this.method = method;
        this.url    = url;
    }

    toJson() {
        return JSON.parse(this.responseData);
    }

    send(data) {        
        return new Promise((resolve, reject) => {
            try {
                if (typeof data !== 'object' && data.length) throw 'type dont\'t supported';
                for(let key in data) {
                    this.data = new FormData();
        
                    this.data.append(key, data[key]);
                }
                
                let xmlHttp = new XMLHttpRequest();
    
                xmlHttp.onloadend = () => {
                    this.responseData = xmlHttp.responseText;
                    return resolve(this);
                };
    
                xmlHttp.open(this.method, this.url, true);
                xmlHttp.send(this.data);
            } catch (error) {
                reject(error);
            }
        });
    }
}

class Controller extends Repository {
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

    async onTextChangeSync() {
        let lastLen = this.getTextLength();

        setTimeout(async () => {
            let newLen = this.getTextLength();

            if (lastLen == newLen) {
                let request  = await (new NativeRequest('POST', '/')).send({ teste: 'a' });
                alert(request.toJson());
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
    constructor() { super(); }

    async listen() {
        this.render();
    }
}

window.onload = () => (new Main).listen();