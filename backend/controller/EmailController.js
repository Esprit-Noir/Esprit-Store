const nodemailer = require('nodemailer');
const expressAsyncHandler = require('express-async-handler');

exports.sendEmail = expressAsyncHandler(async (data, req, res) => {
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAIL_ID,
      pass: process.env.MP,
    },
  });

  let info = await transporter.sendMail({
    from: '"Hey " <mamadouthiandoum96@gmail.com>',
    to: data.to,
    subject: data.subject,
    text: data.text,
    html: data.html,
  });

  console.log('Message send: %s', info.messageId);

  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
});
