const {Router}=require('express');
const { agregarPaciente, obtenerPacientes, obtenerPaciente, actualizarPaciente, eliminarPaciente } = require('../controllers/pacienteController');


const {checkAuth}=require('../middleware/authMiddleware')
const route=new Router();


route.post('/',checkAuth,agregarPaciente);


route.get('/',checkAuth,obtenerPacientes);


route.get('/buscar/:id',checkAuth,obtenerPaciente);
route.put('/actualizar/:id',checkAuth,actualizarPaciente)
route.delete('/eliminar/:id',checkAuth,eliminarPaciente);

module.exports =route;