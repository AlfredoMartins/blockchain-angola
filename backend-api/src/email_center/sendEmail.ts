const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const transporter = nodemailer.createTransport({
    service: process.env.MAILER_SERVICE,
    host: process.env.MAILER_HOST,
    port: process.env.MAILER_PORT,
    secure: true, // Use `true` for port 465, `false` for all other ports
    auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASS,
    },
});

// async..await is not allowed in global scope, must use a wrapper
const sendEmail = async (to: string, textContent: string, htmlContent: string) => {
    const mailOptions = {
        from: `"Angolan Election Committee 2027" <${process.env.MAILER_USER}>`, // sender address
        to: to || "heiopo@inf.elte.hu", // list of receivers
        subject: "Blockchain Angolan Election Credentials", // Subject line
        text: textContent || "Hello, this is a test ...", // plain text body
        html: htmlContent || "<b>Hello world?</b>", // html body
    };

    // send mail with defined transport object
    const info = await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email: ", error);
        } else {
            console.log("Email sent: %s", info.response);
        }
    })

    return info;
}

export default sendEmail;