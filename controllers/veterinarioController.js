const Veterinario = require("../models/veterinario");
const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/generar-jwt');
const { generarId } = require("../helpers/generarid");
const { emailRegistro } = require('../helpers/emailRegistro')
const { emailOlvidePassword } = require('../helpers/emailOlvidePassword');
const veterinarioPost = async (req, res) => {
    const { nombre, email, password } = req.body;

    const existeUsuario = await Veterinario.findOne({ email });

    if (existeUsuario) {
        const error = new Error("Usuario ya registrado")

        return res.status(404).json({ msg: error.message })
    }

    try {
        //Encriptar la contrasenia
        const nuevoVeterinario = new Veterinario({ nombre, email, password });
        const salt = bcryptjs.genSaltSync();
        nuevoVeterinario.password = bcryptjs.hashSync(password, salt);

        //guardar en BD 
        await nuevoVeterinario.save();


        //enviar email
        emailRegistro({
            email, nombre, token: nuevoVeterinario.token
        })

        res.json({
            nuevoVeterinario
        })
    } catch (error) {
        console.log(error);
    }

}


const perfil = async (req, res) => {

    const { usuario } = req;

    res.send({ usuario })
}

const confirmarCuenta = async (req, res) => {

    const { token } = req.params

    const usuarioConfirmar = await Veterinario.findOne({ token })

    if (!usuarioConfirmar) {
        const error = new Error('Token no valido');
        return res.status(404).json({ msg: error.message })
    }

    try {
        usuarioConfirmar.token = null;
        usuarioConfirmar.confirmado = true;
        await usuarioConfirmar.save();
        res.json({ msg: "Usuario confirmado correctamente" })
    } catch (error) {
        console.log(error);
    }
}


const autenticar = async (req, res) => {
    const { email, password } = req.body

    const usuarioExiste = await Veterinario.findOne({ email })

    if (!usuarioExiste) {

        const error = new Error('Usuario no autorizado');
        return res.status(403).json({ msg: error.message })

    }

    // Comprobar si el usuario esta confirmado 
    if (!usuarioExiste.confirmado) {

        const error = new Error('Tu Cuenta no a sido confirmada');
        return res.status(403).json({ msg: error.message })
    }

    //comprobar password
    const comprobarPassword = await bcryptjs.compare(password, usuarioExiste.password);
    if (comprobarPassword) {
        const token = await generarJWT(usuarioExiste.id);
        res.json({
            _id: usuarioExiste._id,
            nombre: usuarioExiste.nombre,
            email: usuarioExiste.email,
            token,
          });
    } else {
        const error = new Error("El Password es incorrecto");
        return res.status(403).json({ msg: error.message });
    }

}

const olvidePassword = async (req, res) => {
    const { email } = req.body;

    const existe = await Veterinario.findOne({ email })

    if (!existe) {
        return res.status(400).json({
            msg: 'Usuario no existe'
        })
    }

    try {
        existe.token = generarId();
        await existe.save();
        emailOlvidePassword({
            email,
            nombre: existe.nombre,
            token: existe.token
        })
        res.json({ msg: 'Hemos enviado un email con las instrucciones' })
    } catch (error) {
        res.status(400).json({
            msg: 'Algo a fallado comuniquese con su proveedor'
        });
    }
}
const comprobarPassword = async (req, res) => {
    const { token } = req.params;

    const tokenValido = await Veterinario.findOne({ token })

    if (tokenValido) {

        res.json({ msg: 'Token valido y el usuario existe' })
    } else {
        return res.status(400).json({
            msg: 'El token no es valido'
        })
    }
}


const nuevoPassword = async (req, res) => {

    const { token } = req.params;
    const { password } = req.body;

    const veterinario = await Veterinario.findOne({ token });

    if (!veterinario) {
        return res.status(400).json({
            msg: 'Hubo un error'
        });
    }

    try {
        veterinario.token = null;
        const salt = bcryptjs.genSaltSync();
        veterinario.password = bcryptjs.hashSync(password, salt);
        await veterinario.save();
        res.json({
            msg: 'Password modificado correctamente'
        })
    } catch (error) {
        return res.status(400).json({
            msg: 'Hubo un error  al cambiar el password'
        });
    }

}

const actualizarPerfil=async(req,res)=>{
    const veterinario = await Veterinario.findById(req.params.id);
    if (!veterinario) {
      const error = new Error("Hubo un error");
      return res.status(400).json({ msg: error.message });
    }
  
    const { email } = req.body;
    if (veterinario.email !== req.body.email) {
      const existeEmail = await Veterinario.findOne({ email });
  
      if (existeEmail) {
        const error = new Error("Ese email ya esta en uso");
        return res.status(400).json({ msg: error.message });
      }
    }
  
    try {
      veterinario.nombre = req.body.nombre;
      veterinario.email = req.body.email;
      veterinario.web = req.body.web;
      veterinario.telefono = req.body.telefono;
  
      const veterianrioActualizado = await veterinario.save();
      res.json(veterianrioActualizado);
    } catch (error) {
      console.log(error);
    }
};
const actualizarPassword = async (req, res) => {
     // Leer los datos
    const { _id } = req.body.auth;
    const { pwd_actual, pwd_nuevo } = req.body.datos;
   
    // Comprobar que el veterinario existe
    const veterinario = await Veterinario.findById(_id);
    if (!veterinario) {
      const error = new Error("Hubo un error");
      return res.status(400).json({ msg: error.message });
    }
  
    // Comprobar su password
    const comprobarPassword = await bcryptjs.compare(pwd_actual, veterinario.password);


    if (comprobarPassword) {
      // Almacenar el nuevo password
      const salt = bcryptjs.genSaltSync();
      veterinario.password = bcryptjs.hashSync(pwd_nuevo, salt);
      await veterinario.save();
      res.json({ msg: "Password Almacenado Correctamente" });
    } else {
      const error = new Error("El Password Actual es Incorrecto");
      return res.status(400).json({ msg: error.message });
    } 
  };

module.exports = {
    veterinarioPost
    , perfil
    , confirmarCuenta
    , autenticar
    , olvidePassword
    , comprobarPassword
    , nuevoPassword
    ,actualizarPerfil
    ,actualizarPassword
}