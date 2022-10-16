
const {Schema,model}=require("mongoose");
const {generarId}=require('../helpers/generarid')


const Veterinario=Schema({

    nombre:{
        type: String,
        require:[true,'El nombre es requerido'],
        trim:true
    },
    password:{
        type: String,
        required: [true,'El contrasenia es obligatoria']
    },
    email:{
        type: String,
        require:true,
        unique: true,
        trim:true
    },
    telefono:{
        type: String,
        default:null,
        trim:true
    },
    web:{
        type: String,
        default:null,
    },
    token:{
        type: String,
        default:generarId()
    },
    confirmado:{
        type:Boolean,
        default:false
    }


});


module.exports =model('Veterinario',Veterinario)