const express=require('express');
const cors=require('cors');

const { conectarDB }=require('../database/config');

class Server{

    constructor(){
        this.app=express();
        this.port=process.env.PORT || null ;
        
        //Conectar la base de datos
        this.dbConection();
        //midlewares
        this.midlewares();
        this.route();
    }

    midlewares(){
        this.app.use(express.json());
        this.app.use(cors());
    }

    async dbConection(){
        await conectarDB();
    }

    route(){
        this.app.use('/',require('../routers/router'));
        this.app.use('/pacientes/',require('../routers/pacientesRoutes'));
    }

    listen(){
        this.app.listen(this.port,()=>{
            console.log(`express se esta corriendo por el servidor ${this.port}`);
        });
    }
}

module.exports = Server;