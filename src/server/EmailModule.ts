import * as nodemailer from 'nodemailer';
import { configModule } from './ConfigModule';

function setupTransporter(){
    const config: any = configModule.getConfigValue('mail');

    // Definimos el transporter
    return nodemailer.createTransport({
        host: config.host,
        secure: config.secure,
        auth: {
            user: config.user,
            pass: config.pass
        }
    });
}

function sendEmail(subject: string, body: string, to: string){
    const from: string = configModule.getConfigValue('mail.from');
    const transporter = setupTransporter();

    const mailOptions = {
        from,
        to,
        subject,
        text: body
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error){
            console.log(error);
        } else {
            console.log("Email sent", mailOptions);
        }
    });
};

function sendHTMLEmail(subject: string, html: string, to: string){
    const from: string = configModule.getConfigValue('mail.from');
    const transporter = setupTransporter();

    const mailOptions = {
        from,
        to,
        subject,
        html
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error){
            console.log(error);
        } else {
            console.log("Email sent", mailOptions);
        }
    });
}

export default { sendEmail, sendHTMLEmail };
