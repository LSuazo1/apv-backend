const jwt = require('jsonwebtoken');
const Veterinario = require("../models/veterinario");
const checkAuth = async (req, res, next) => {

    const token = req.header('token');

    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la peticion'
        });
    }

   try {
        const { uid } = jwt.verify(token, process.env.JWT_SECRET);

        const usuario = await Veterinario.findById(uid).select("-password -token -confirmado")


        if (!usuario) {
            return res.status(401).json({
                msg: 'Token no valido- usuario no existe'
            })
        }
     
        req.usuario=usuario;

        next();
    

    } catch (error) {
        return res.status(401).json({
            msg: 'Token no valido'
        })
    } 

}

module.exports = { checkAuth };