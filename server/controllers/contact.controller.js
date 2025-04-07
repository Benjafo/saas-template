const nodemailer = require('nodemailer');

/**
 * @desc    Send contact form message
 * @route   POST /api/v1/contact
 * @access  Public
 */
exports.sendContactMessage = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, company, message } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !message) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide all required fields: first name, last name, email, and message',
      });
    }

    // In a real application, you would send an email here
    // For this template, we'll just log the message and return a success response
    console.log('Contact form submission:', {
      name: `${firstName} ${lastName}`,
      email,
      phone: phone || 'Not provided',
      company: company || 'Not provided',
      message,
      timestamp: new Date().toISOString(),
    });

    // Example of how you would send an email in a real application:
    /*
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"${firstName} ${lastName}" <${email}>`,
      to: process.env.CONTACT_EMAIL,
      subject: `New contact form submission from ${firstName} ${lastName}`,
      text: `
        Name: ${firstName} ${lastName}
        Email: ${email}
        Phone: ${phone || 'Not provided'}
        Company: ${company || 'Not provided'}
        
        Message:
        ${message}
      `,
      html: `
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Company:</strong> ${company || 'Not provided'}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });
    */

    res.status(200).json({
      status: 'success',
      message: 'Your message has been sent successfully. We will get back to you soon!',
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while sending your message. Please try again later.',
    });
  }
};
