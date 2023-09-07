import nodemailer from 'nodemailer';

const SendMail = (req, res) => {
  if (req.method === 'POST') {
    const { comentariosRechazo, adminEmail, adminName } = req.body;
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER,
      port: process.env.EMAIL_PORT,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    const message = {
      from: process.env.EMAIL_FROM,
      to: adminEmail,
      subject: 'Comentarios sobre tu empresa en Gente DeMente',
      html: `
      <p>¡Hola ${adminName.split(' ')[0]}!</p>
      <p>En el equipo de GenteDeMente hemos revisado tu solicitud de creación de empresa y tenemos algunos comentarios que debes tener en cuenta antes de que podamos aprobarla:</p>
      <p>${comentariosRechazo}</p>
      <p>¡Agradecemos tu comprensión y esperamos tus correcciones!</p>
      `,
    };
    try {
      transporter.sendMail(message);
      return res.status(200).json({ status: 'message sent' });
    } catch {
      return res.status(500).json({ status: 'error sending message' });
    }
  }
};

export default SendMail;
