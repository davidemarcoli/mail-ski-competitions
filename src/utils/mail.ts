import * as nodemailer from 'nodemailer';

export const sendMail = async (subject: string, text: string) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.FROM_MAIL,
            pass: process.env.MAIL_PASSWORD
        }
    });

    var mailOptions = {
        from: process.env.FROM_MAIL,
        to: process.env.TO_MAIL?.split(";"),
        subject,
        text
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.error(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}