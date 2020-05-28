const Util = require('./util');

class Loggable extends Util {
    constructor() {
        super();
    }

    /**
     * @param {*} time[Number]
     * 
     * <summary>
     *      esta função tem a principal funcionalidade de criar um delay.
     *      o setTimeout é uma função nativa que se encontra tanto no front-end
     *      como no back-and no nodejs, ele executa o escopo da função @param {*} code
     *      após o @param time[Float].
     * 
     *      exemplo: 1.1 é um segundo e 1 milésimo
     *               1   é um segundo
     *               2.5 é dois segundos e 5 milésimo
     * 
     *      está função retorna uma @return {Promise} uma função asyncrona.
     * </summary>
     */
    sleep(time = new Number()) {
        time = parseFloat(time) || 1;
        return new Promise((resolve) => {
            setTimeout(() => {
                return resolve(true);
            }, time);
        });
    }

    /**
     * @param {*} color uma cor em string.
     * 
     * <summary>
     *      retorna uma cor que modifica a coloração da mensagem no terminal.
     * </summary>
     */
    color(color = new String()) {
        switch (color) {
            case 'black': return '\x1b[30m';
            case 'red': return '\x1b[31m';
            case 'green': return '\x1b[32m';
            case 'yellow': return '\x1b[33m';
            case 'blue': return '\x1b[34m';
            case 'magenta': return '\x1b[35m';
            case 'cyan': return '\x1b[36m';
            case 'white':
            default: return '\x1b[37m';
        }
    }

    /**
     * @param {*} option[Object] {
     *   @param color[String],
     *   @param delay[Object] {
     *      @param lastLog[Number],
     *      @param afterLog[Number]
     *   },
     *   @param time[Date]
     *   @param message[String]
     * }
     * 
     * <summary>
     *      loga uma informação no terminal
     * </summary>Config
     */
    async log(option = this.Options.LogOption) {
        if (option.delay  && option.delay.lastLog) await this.sleep(option.delay.lastLog);

        option.message = this.color(option.color) + option.message;
        console.log(option.message);

        if (option.delay  && option.delay.afterLog) await this.sleep(option.delay.afterLog);
    }
}

module.exports = Loggable;