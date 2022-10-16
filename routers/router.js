const { Router }=require('express');
const {checkAuth}=require('../middleware/authMiddleware')
const {veterinarioPost,perfil,
    confirmarCuenta, autenticar, olvidePassword,
     nuevoPassword, comprobarPassword,actualizarPerfil,actualizarPassword}=require('../controllers/veterinarioController');


const route = new Router();
//Area publica
route.post('/',veterinarioPost);
route.get('/confirmar/:token',confirmarCuenta);
route.post('/login',autenticar);
route.post('/olvide-password',olvidePassword)

route.get('/olvide-password/:token',comprobarPassword);
route.post('/olvide-password/:token',nuevoPassword);

//Area privada
route.get('/perfil',checkAuth,perfil);
route.put('/perfil/:id',checkAuth,actualizarPerfil);

route.put('/actualizar-password',actualizarPassword);
module.exports = route;