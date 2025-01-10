const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", // port for secure SMTP
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_PASSWORD,
  },
  tls: { rejectUnauthorized: false },
});

module.exports = (email, otpcode) => {
  return new Promise((resolve, reject) => {
    const options = {
      from: `NextCommerce <${process.env.USER_EMAIL}>`,
      to: email,
      subject: "One-Time Password (OTP) for Login",
      text: `Your OTP Code is  ${otpcode}`,
      html: `Your OTP Code is <b>${otpcode}</b>`,
    };

    transporter.sendMail(options, (err, info) => {
      if (err) {
        console.log(err);
        return reject({
          message: `An error occurred while sending, ${err.message}`,
        });
      }
      return resolve({ message: "email sent successfully" });
    });
  });
};
