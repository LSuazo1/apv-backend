const Paciente = require('../models/paciente');


const agregarPaciente = async (req, res) => {
    console.log("Datos Paciente:/n:",req.body);

    const paciente = new Paciente(req.body);
    paciente.veterinario = req.usuario._id;
    try {
        const pacienteAlmacenado = await paciente.save();
        res.json({
            pacienteAlmacenado
        })
    } catch (error) {
        res.status(400).json({
            msg: 'Error al agregar paciente backend'+error
        })

        
    }

}



const obtenerPacientes = async (req, res) => {
    const { _id } = req.usuario;
    const pacientes = await Paciente.find().where("veterinario").equals(req.usuario);
    res.json({ pacientes });
}

const obtenerPaciente = async (req, res) => {
    const { id } = req.params;
    try {
        const paciente = await Paciente.findById(id);
        res.json({ paciente }) 
    } catch (error) {
        res.status(400).json({
            msg: 'Paciente no encontrado'
        });
    }
}
const actualizarPaciente = async (req, res) => {
    const { id} = req.params;
    const {_id,...resto}=req.body;

    console.log(req.body); 

    try {
        await Paciente.findByIdAndUpdate (id,resto);
        res.json({ msg:'Se a actualizado correctamente' })
    } catch (error) {
        res.status(400).json({
            msg: 'Paciente no encontrado'
        });
    }


}
const eliminarPaciente = async (req, res) => {
    const { id } = req.params;
    try {
        ;
        await Paciente.findByIdAndDelete({_id:id});
        res.json({
            msg: 'paciente eliminado'
        })
    } catch (error) {
        console.log(error);
    }
}


module.exports = {
    obtenerPacientes,
    agregarPaciente,
    obtenerPaciente,
    actualizarPaciente,
    eliminarPaciente
}