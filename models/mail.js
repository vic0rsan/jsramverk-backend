const sgMail = require('@sendgrid/mail');

const docs = require('../models/docs');
const apiKey = process.env.MAIL_KEY;
const mailFrom = process.env.MAIL_FROM;

sgMail.setApiKey(apiKey);

const mail = {
    sendMail: async function (req, res) {
        const email = req.body.email;
        const docTitle = req.body.title;

        docs.addUserToDoc(req, res);

        const msg = {
            to: email,
            from: mailFrom,
            subject: 'Invitation to edit document',
            text: 'You have been invited',
            html: `<h1>You have been invited to the document <i>${docTitle}</i></h1>
                    <h2>You can now edit the document at <i>TheEditor</i> in the link below.</h2>
                    <b>Before you start:</b> 
                    you will need to create an account at our site using your current email.
                    <br><a href="https://www.student.bth.se/~gusu20/editor/">Register link.</a>`
        };

        await sgMail.send(msg);
    }
};

module.exports = mail;
