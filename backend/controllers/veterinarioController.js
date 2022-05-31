import Veterinario from "../models/Veterinario.js";
import generarJWT from "../helpers/generarJWT.js";
import generarId from "../helpers/generarId.js";

const registrar = async (req, res) => {
    const {email } = req.body;
    const existeUsuario = await Veterinario.findOne({email})
    if(existeUsuario){
        const error = new Error('Usuario ya registrado!');
        return res.status(400).json({msg: error.message});
    }

    try {
        const veterinario = new Veterinario(req.body);
        const veterinarioGuardado = await veterinario.save();
    } catch (error) {
        console.log(error)
    }

    res.json({ msg: 'Registrando cuenta!' })
}

const perfil =  (req, res) => {
    const { veterinario} = req;

    res.json({ veterinario })
}

const confirmar = async (req, res) =>{
    const {token} = req.params;
    const usuarioConfirmado = await Veterinario.findOne({token});
    if(!usuarioConfirmado) {
        const error = new Error('Usuario no encontrado');
        return res.status(404).json({msg: error.message})
    }
    try {
        usuarioConfirmado.token = null;
        usuarioConfirmado.confirmado = true;
        await usuarioConfirmado.save();
        res.json({msg: 'Usuario confirmado Correctamente'})
    } catch (error) {
        console.log(error)
    }


}

const autenticar = async (req, res) => {
    const {email, password} = req.body;
    //Comprobar si el usuario existe
    const usuario = await Veterinario.findOne({email})
    if(!usuario) {
        const error = new Error('El usuario no existe!');
        return res.status(401).json({msg: error.message})
    }
    //Comprobar si el usuario esta confirmado
    if(!usuario.confirmado) {
        const error = new Error('El usuario no ha sido confirmado');
        return res.status(403).json({msg: error.message});
    }
    if(await usuario.comprobarPassword(password)) {
        console.log(usuario)
        res.json({token: generarJWT(usuario.id)})
    }else {
        const error = new Error('La contraseña es incorrecta');
        return res.status(403).json({msg: error.message});
    }
}

const olvidePassword = async (req, res) => {
    const {email} = req.body;

    const existeVeterinario = await Veterinario.findOne({email});
    if(!existeVeterinario) {
        const error = new Error('el usuario no existe');
        return res.status(400).json({msg: error.message})
    }
    try {
        existeVeterinario.token = generarId();
        await existeVeterinario.save();
        res.json({msg: 'Hemos enviado un email con las instrucciones'})
    } catch (error) {
        console.log(error)
    }
}
const comprobarToken = async (req, res) => {
    const {token} = req.params;

    const tokenValido = await Veterinario.findOne({token});
    if(tokenValido){
        res.json({msg: 'Token valido el usuario existe'})
    }else {
        const error = new Error('Token no valido')
        return res.status(400).json({msg: error.message})
    }
}
const nuevoPassword = async (req, res) => {
    const {token} = req.params;

    const {password} = req.body;

    const veterinario = await Veterinario.findOne({token});
    if(!veterinario) {
        const error = new Error('hubo un error')
        return res.status(400).json({msg: error.message})
    }
    try {
        veterinario.token = null;
        veterinario.password = password;
        await veterinario.save();
        res.json({msg: "password modificado correctamente"});
    } catch (error) {
        console.log(error)
    }
}

export {
    registrar,
    perfil,
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword
}