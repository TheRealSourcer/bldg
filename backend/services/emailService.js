import { transporter } from "../config/emailTransporterConfig.js";

const sendOrderTrackingEmail = async (recipientEmail, trackingNumber) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: recipientEmail,
    subject: 'Your FedEx Order Tracking Number',
    text: `Your FedEx tracking number is: ${trackingNumber}`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export default sendOrderTrackingEmail;
