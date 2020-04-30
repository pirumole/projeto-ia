/** carrega as @param env[variaveis_de_ambientes] configuradas @param no[.env] */
require('dotenv').config();

/** importa o @param App arquivo js no repositorio app\index.js */
const App = require('./app');

/** @param class[Main] que inicia o servidor. */
class Main extends App {
    constructor() {
        super();
    }

    /**
     * função assincrona @function listen[ouvinte]
     * inicia todos os processos.
     */
    async listen() {
        /** inicia @param configuração */
        await this.setConfig();
    }
}

(new Main).listen();