const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "wilhelmine.russel62@ethereal.email",
    pass: "Ugsr7SSgRYJJwtTVKw",
  },
});

// Message object
let message = {
  from: "ali@gmail.com",
  to: "maxwell.mayert61@ethereal.email",
  subject: " nodemailer mehrdaddd",
  text: "simple test of nodemailers",
};

exports.sendEmail = (email, fullname, subject, message) => {
  transporter.sendMail({
    from: fullname,
    to: email,
    subject: subject,
    html: `<h1> زمان و تاریخ ورد شما ${Date.now()} </h1>
    <p>${message}</p>
    `,
  });
};
