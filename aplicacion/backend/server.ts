//Aqui se encuentra toda la configuracion de rutas, middlewares, puertos, conexiones a db y errores.
import "dotenv/config";
import express from "express";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";

import ENV from "./src/config/env";

import userRouter from "./src/usuario/router";
import recursoRouter from './src/recurso/router';
import reservaRouter from './src/reserva/router';
import auditoriaRouter from "./src/auditoria/router";

export class Server{
    private app: express.Application;

    constructor(){

        this.app = express();
        this.middlewares();
        this.routes();
    }

    middlewares(){
        this.app.use(cors({
            origin: "*"
        }));
        this.app.use(express.json());
        this.app.use(cookieParser());
    }

    routes(){
        const backend = path.basename(__dirname) === 'dist' ? path.dirname(__dirname) : __dirname;
        this.app.use(express.static(path.join(backend, '../frontend')));
        this.app.use('/api/users', userRouter);
        this.app.use('/api/recurso', recursoRouter);
        this.app.use('/api/reserva', reservaRouter);
        this.app.use('/api/auditoria', auditoriaRouter);
    }

    listen(){
        this.app.listen(ENV.PORT, () => {
            console.log('Server running on port', ENV.PORT);
        });
    }
}
