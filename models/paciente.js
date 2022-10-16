const {Schema,model}=require("mongoose");


const Paciente=Schema({

    nombre:{
        type:String,
        required:true
    },
    propietario:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    fecha:{
        type:Date,
        required:true,
        default:Date.now()
    },
    sintomas:{
        type:String,
        required:true
    },
    veterinario:{
        type: Schema.Types.ObjectId,
        ref:'Veterinario'
    }

},{
    timestamp:true,
});

module.exports=model('Paciente',Paciente)