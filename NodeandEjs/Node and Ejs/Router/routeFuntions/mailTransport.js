const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    host: "mail1.novalnetsolutions.com",
    port: 465,
    secure: true,
    auth: {
      user: "balamurugan_v@novalnetsolutions.com",
      pass: "Mndnua^9378ADlkfcjiufd",
    },
  });

  module.exports = {transporter}