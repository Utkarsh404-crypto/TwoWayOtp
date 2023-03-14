const Twilio = require('twilio');
const nodemailer = require("nodemailer");
const dotenv = require("dotenv")
const Web3 = require('web3');
const OtpInstance = require("../../client/src/contracts/OtpGenarate.json");
dotenv.config();

const client = new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);


const getOtp = async(req, res) => {

    const contactNumber = req.body.contactNumber;

    const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
    const accounts = await web3.eth.getAccounts();

    const otpInstance = new web3.eth.Contract(
        OtpInstance.abi,
        "0x1c49Eda84353465bDbCDfCDf16f74Fa2f6DAeEaE"
    );

    const data = await otpInstance.methods
        .GenerateOtp(web3.utils.toBN(contactNumber))
        .send({ from: accounts[0] });
    // console.log(data.events.OtpCreationEvent.returnValues.OtpId);

    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass, // generated ethereal password
        },
    });

    client.messages.create({
        to: `+91${contactNumber}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        body: `Your OTP is: ${data.events.OtpCreationEvent.returnValues.OtpId}`
    });


    setTimeout(async() => {

        const data = await otpInstance.methods
            .GenerateOtp(web3.utils.toBN(contactNumber))
            .send({ from: accounts[0] });

        const message = {
            from: '"Fred Foo 👻" <foo@example.com>', // sender address
            to: "bar@example.com, baz@example.com", // list of receivers
            subject: "OTP", // Subject line
            text: `${data.events.OtpCreationEvent.returnValues.OtpId}`, // plain text body
            html: `${data.events.OtpCreationEvent.returnValues.OtpId}`, // html body
        }

        transporter.sendMail(message).then((info) => {
            console.log({
                msg: "you should receive an email",
                info: info.messageId,
                preview: nodemailer.getTestMessageUrl(info)
            });
        }).catch(error => {
            return res.status(500).json({ error })
        })
    }, 120000)

    const verify = await otpInstance.methods
        .VerifyOtp(web3.utils.toBN(contactNumber), data.events.OtpCreationEvent.returnValues.OtpId)
        .send({ from: accounts[0] });
    console.log(verify.status);


}

module.exports = { getOtp };