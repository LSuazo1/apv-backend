const nodemailer=require('nodemailer');

const  emailOlvidePassword=async(datos)=>{
    var transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      //enviar el email
      const {email,nombre,token}=datos;
      console.log(datos);
        console.log(nombre);
      const info=await transporter.sendMail({
        from: "APV-Administrador de PAcientes de Veterinaria",
        to:email,
        subject: "Reestablece tu Password",
        text:"Reestablece tu Password",
        html:`<p>Hola:${nombre}, has solicitado reestablecer tu password</p>
        <p>Sigue el siguiente enlace generar un nuevo password:
        <a href="${process.env.FRONTEND_URL}/olvide-password/${token}" >Reestablecer password</a></p>

        <p>Si tu no creaste esta cuenta,puedes ignorar este mensaje</p>
        `
      });

      console.log("Mensaje enviado: %s", info.messageId);
}


module.exports={emailOlvidePassword}