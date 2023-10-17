import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "arularunoffical1110@gmail.com",
    pass: " ttwm srez psgg tufg",
  },
});

 const sendResetPasswordEmail = async (to, resetLink) => {
  const mailOptions = {
    from: "arularunoffical1110@gmail.com",
    to ,
    subject: "Password Reset",
    html: `Click the following link to reset your password: <a href="${resetLink}">${resetLink}</a>`,
    
  };

   
  await transporter.sendMail(mailOptions);

};
export default sendResetPasswordEmail;