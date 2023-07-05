const nodeMailer = require('nodemailer');

exports.sendEmail = async (options) => {
  if (parseInt(process.env.SEND_EMAIL_ENABLED, 10)) {
    const transporter = nodeMailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: true, // true for 465, false for other ports
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // generated ethereal user
        pass: process.env.EMAIL_PASS, // generated ethereal password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER, // sender address
      to: options.email, // list of receivers
      subject: options.subject, // Subject line
      html: options.message, // plain text body
    };

    await transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.log('Error: ', error);
      } else {
        console.log('Email sent successfully');
      }
    });
  }
};

exports.addMonths = (date, numMonths) => {
  const newDate = new Date(date.getTime());
  const currentMonth = newDate.getMonth();

  for (let i = 0; i < numMonths; i++) {
    const targetMonth = currentMonth + i;
    const yearOffset = Math.floor(targetMonth / 12);
    const remainingMonths = targetMonth % 12;

    const maxDays = new Date(newDate.getFullYear() + yearOffset, remainingMonths + 1, 0).getDate();
    newDate.setDate(newDate.getDate() + maxDays);
  }

  return newDate;
};

/*
 * This code checks if an email has already been sent within the past hour
 * by comparing the given date with the current time
 */
exports.emailAlreadySent = (date) => {
  const now = new Date();
  const differenceMs = now - date;
  const differenceMinutes = differenceMs / (1000 * 60);
  return differenceMinutes < process.env.SEND_EMAIL_WAITING_TIME;
};

exports.pendingMail = (fullName) => `
  <div class="container" style="padding: 20px;">
    <a href="http://localhost:5173" target="_blank">
      <img style="width: 50px; display: block; margin: 20px auto;" src="https://i.ibb.co/qmYyrkX/logo.png" alt="central-bank-logo">
    </a>
    <hr style="border: 1px solid #EEEEEE;" />
    <h1 style="text-align: center; color: #ED1B24;">Blood Donation Confirmation</h1>
    <p style="text-align: justify; color: #000000;">
      Dear ${fullName.split(' ')[0]} ${fullName.split(' ')[fullName.split(' ').length - 1]},<br /><br />
      We hope this email finds you well. We wanted to update you on the status of your recent donation request. Currently, <strong>your donation is undergoing a virus review process to ensure its safety and quality.</strong><br /><br />
      Our team is working diligently to complete the necessary checks, and we appreciate your patience during this time. Rest assured that we will notify you as soon as the review is complete. If any issues arise, we will provide you with further details and guidance.<br /><br />
      Thank you for your understanding and for your commitment to our cause. Your support is invaluable to us, and we are grateful for your generosity. Together, we can make a positive impact on the lives of those in need.<br /><br />
      Best regards,<br /><br />
      Central Blood Bank
    </p>
  </div>
`;

exports.acceptanceMail = (fullName) => `
  <div class="container" style="padding: 20px;">
    <a href="http://localhost:5173" target="_blank">
      <img style="width: 50px; display: block; margin: 20px auto;" src="https://i.ibb.co/qmYyrkX/logo.png" alt="central-bank-logo">
    </a>
    <hr style="border: 1px solid #EEEEEE;" />
    <h1 style="text-align: center; color: #ED1B24;">Blood Donation Confirmation</h1>
    <p style="text-align: justify; color: #000000;">
      Dear ${fullName.split(' ')[0]} ${fullName.split(' ')[fullName.split(' ').length - 1]},<br /><br />
      We have fantastic news for you! <strong>Your donation has been accepted</strong>, and we want to express our sincerest gratitude for your incredible generosity.<br /><br />
      We are thrilled to have you on board as a valued supporter, and your kindness is making a real difference in the lives of those we serve.<br /><br />
      Thank you for believing in our mission and for your unwavering commitment to making the world a better place. We couldn't do it without you!<br /><br />
      With heartfelt appreciation,<br /><br />
      Central Blood Bank
    </p>
  </div>
`;

exports.rejectionMail = (fullName, rejectionReason) => `
  <div class="container" style="padding: 20px;">
    <a href="http://localhost:5173" target="_blank">
      <img style="width: 50px; display: block; margin: 20px auto;" src="https://i.ibb.co/qmYyrkX/logo.png" alt="central-bank-logo">
    </a>
    <hr style="border: 1px solid #EEEEEE;" />
    <h1 style="text-align: center; color: #ED1B24;">Blood Donation Confirmation</h1>
    <p style="text-align: justify; color: #000000;">
      Dear ${fullName.split(' ')[0]} ${fullName.split(' ')[fullName.split(' ').length - 1]},<br /><br />
      We sincerely appreciate your generosity and your commitment to supporting our cause. However, we regret to inform you that we are unable to accept your recent donation request at this time.<br /><br />
      <strong>Rejection Reason:</strong> ${rejectionReason}<br /><br />
      We understand that this may be disappointing, but please be assured that your intention to contribute is highly valued. We encourage you to consider donating in the future, and we will be delighted to welcome you back as a donor.<br /><br />
      Thank you for your understanding and ongoing support. Together, we can make a difference.<br /><br />
      Best regards,<br /><br />
      Central Blood Bank
    </p>
  </div>
`;

exports.rejectionMailThreeMonths = (fullName, date) => `
  <div class="container" style="padding: 20px;">
    <a href="http://localhost:5173" target="_blank">
      <img style="width: 50px; display: block; margin: 20px auto;" src="https://i.ibb.co/qmYyrkX/logo.png" alt="central-bank-logo">
    </a>
    <hr style="border: 1px solid #EEEEEE;" />
    <h1 style="text-align: center; color: #ED1B24;">Blood Donation Confirmation</h1>
    <p style="text-align: justify; color: #000000;">
      Dear ${fullName.split(' ')[0]} ${fullName.split(' ')[fullName.split(' ').length - 1]},<br /><br />
      We sincerely appreciate your previous donation and your commitment to supporting our cause.<strong> However, we regret to inform you that we are unable to accept your recent donation request.</strong><br /><br />
      <strong>Our records indicate that you have made a donation within the last three months.</strong> As per our donation guidelines, we require a minimum waiting period of three months between donations.<br /><br />
      We value your dedication and enthusiasm to contribute. You can donate again after <strong>${this.addMonths(date, 3).toLocaleDateString('en-UK')}</strong>, we will be delighted to welcome you back as a donor.<br /><br />
      Thank you for your ongoing support, and we look forward to your future contributions.<br /><br />
      Best regards,<br /><br />
      Central Blood Bank
    </p>
  </div>
`;

exports.generateFakeEmail = () => {
  const randomString = Math.random().toString(36).substring(2, 10);
  const randomDomain = Math.random().toString(36).substring(2, 10);
  return `${randomString}@${randomDomain}.com`;
};

exports.generateNationalId = () => {
  let randomDigits = '';
  for (let i = 0; i < 13; i++) {
    randomDigits += Math.floor(Math.random() * 10);
  }
  const number = `2${randomDigits}`;
  return parseInt(number, 10);
};

exports.generateRandomDate = (rangeInDays) => new Date(
  Date.now() + Math.floor(Math.random() * rangeInDays * 24 * 60 * 60 * 1000),
);

exports.toCapitalCase = (str) => str.charAt(0).toUpperCase() + str.slice(1);
