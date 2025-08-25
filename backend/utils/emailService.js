const nodemailer = require('nodemailer');

// Create transporter (configure with your email provider)
const transporter = nodemailer.createTransport({
    service: 'gmail', // or your preferred email service
    auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS  // Your email password or app password
    }
});

// Email template for sending credentials
const sendCredentialEmail = async (recipientEmail, password, role) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipientEmail,
        subject: 'Welcome to CHARUSAT Placement Prep - Your Account Credentials',
        html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Welcome to CHARUSAT Placement Prep</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
                <div style="max-width: 650px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
                    <!-- Header Section -->
                    <div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; padding: 30px 20px; text-align: center;">
                        <h1 style="margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 1px;">CHARUSAT UNIVERSITY</h1>
                        <p style="margin: 8px 0 0 0; font-size: 14px; opacity: 0.9;">Placement Preparation Platform</p>
                        <div style="margin-top: 15px; padding: 8px 16px; background: rgba(255,255,255,0.1); border-radius: 20px; display: inline-block;">
                            <span style="font-size: 12px; font-weight: 500; text-transform: uppercase;">Connect • Prepare • Succeed</span>
                        </div>
                    </div>
                    
                    <!-- Main Content -->
                    <div style="padding: 30px 20px;">
                        <h2 style="color: #1f2937; font-size: 22px; margin: 0 0 20px 0; font-weight: 600; text-align: center;">
                            ${role === 'student' ? '🎓 Welcome Student!' : '👨‍💼 Welcome Alumni!'}
                        </h2>
                        
                        <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
                            Dear ${role === 'student' ? 'Future Professional' : 'Esteemed Alumni'},
                        </p>
                        
                        <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                            ${role === 'student' 
                                ? 'Your account has been successfully created for CHARUSAT Placement Prep platform! Get ready to connect with alumni, gain industry insights, and boost your placement preparation journey. Best of luck for your upcoming placements! 🚀' 
                                : 'Your account has been successfully created for CHARUSAT Placement Prep platform! Thank you for joining us to mentor and guide our students. Your industry experience and company reviews will be invaluable for our students\' placement preparation.'
                            }
                        </p>
                        
                        <!-- Credentials Box -->
                        <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); border: 2px solid #cbd5e1; border-radius: 12px; padding: 25px 20px; margin: 25px 0; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
                            <h3 style="color: #1e40af; margin: 0 0 20px 0; font-size: 16px; font-weight: 600; text-align: center; text-transform: uppercase; letter-spacing: 0.5px;">Login Credentials</h3>
                            
                            <div style="margin: 15px 0; display: flex; align-items: center; flex-wrap: wrap;">

                                <p style="margin: 0; color: #374151; font-size: 14px; word-break: break-all;">
                                    <strong style="color: #1f2937;">Email:</strong> 
                                    <span style="font-family: 'Courier New', monospace; color: #5b99fdff; font-weight: 500;">${recipientEmail}</span>
                                </p>
                            </div>
                            
                            <div style="margin: 15px 0; display: flex; align-items: center; flex-wrap: wrap;">
                                <p style="margin: 0; color: #374151; font-size: 14px; word-break: break-all;">
                                    <strong style="color: #1f2937;">Password:</strong> 
                                    <span style="font-family: 'Courier New', monospace; padding: 4px 8px; border-radius: 4px; color: #10b981; font-weight: 600;">${password}</span>
                                </p>
                            </div> 
                        </div>
                        
                        <!-- Role-specific Features -->
                        <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin: 25px 0;">
                            <h4 style="color: #1f2937; margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">
                                ${role === 'student' ? '🎯 What you can do as a Student:' : '🏢 What you can do as an Alumni:'}
                            </h4>
                            <ul style="color: #4b5563; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
                                ${role === 'student' 
                                    ? `
                                        <li style="margin: 8px 0;">Connect with alumni from your field of interest</li>
                                        <li style="margin: 8px 0;">Get company reviews and interview experiences</li>
                                        <li style="margin: 8px 0;">Access placement preparation resources</li>
                                        <li style="margin: 8px 0;">Join placement discussion forums</li>
                                        <li style="margin: 8px 0;">Get mentorship from industry professionals</li>
                                        <li style="margin: 8px 0;">Stay updated with placement opportunities</li>
                                    `
                                    : `
                                        <li style="margin: 8px 0;">Share your company experience and reviews</li>
                                        <li style="margin: 8px 0;">Mentor students from your department</li>
                                        <li style="margin: 8px 0;">Provide interview tips and guidance</li>
                                        <li style="margin: 8px 0;">Share industry insights and trends</li>
                                        <li style="margin: 8px 0;">Help students with placement preparation</li>
                                        <li style="margin: 8px 0;">Post job opportunities from your company</li>
                                    `
                                }
                            </ul>
                        </div>
                        
                        <!-- Call-to-Action Message -->
                        <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border: 1px solid #0369a1; border-radius: 8px; padding: 20px; margin: 25px 0; text-align: center;">
                            <p style="margin: 0; color: #0369a1; font-size: 14px; font-weight: 500;">
                                ${role === 'student' 
                                    ? '🌟 <strong>Ready to ace your placements?</strong> Connect with alumni, learn from their experiences, and get industry-ready!'
                                    : '🤝 <strong>Ready to give back?</strong> Share your journey, guide students, and help them achieve their career dreams!'
                                }
                            </p>
                        </div>
                        
                        <!-- Important Notice -->
                        <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 15px 20px; margin: 25px 0; border-radius: 0 6px 6px 0;">
                            <p style="margin: 0; color: #b91c1c; font-size: 14px; font-weight: 500;">
                                <strong>🔒 Security Notice:</strong> Please change your password after your first login for enhanced security.
                            </p>
                        </div>
                        
                        <!-- Access Button -->
                        <div style="text-align: center; margin: 35px 0;">
                            <a href="http://localhost:3000" style="display: inline-block; background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; letter-spacing: 0.5px; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);">
                                ${role === 'student' ? '🚀 Start Your Placement Journey' : '🎯 Begin Mentoring Students'}
                            </a>
                        </div>
                        
                        <!-- Success Message -->
                        <div style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border: 1px solid #10b981; border-radius: 8px; padding: 20px; margin: 25px 0; text-align: center;">
                            <p style="margin: 0; color: #065f46; font-size: 14px; font-weight: 500;">
                                ${role === 'student' 
                                    ? '🎉 <strong>Best of luck for your placements!</strong> We believe in your potential and success!'
                                    : '🙏 <strong>Thank you for supporting our students!</strong> Your guidance will make a real difference!'
                                }
                            </p>
                        </div>
                        
                        <!-- Support Section -->
                        <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 20px; margin: 25px 0;">
                            <p style="margin: 0; color: #1e40af; font-size: 14px; text-align: center;">
                                <strong>Need Help?</strong> Contact our support team for technical assistance or platform guidance.
                            </p>
                        </div>
                    </div>
                    
                    <!-- Footer -->
                    <div style="background-color: #f3f4f6; padding: 25px 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                        <p style="margin: 0 0 10px 0; color: #1f2937; font-weight: 600; font-size: 16px;">Best regards,</p>
                        <p style="margin: 0 0 15px 0; color: #3b82f6; font-weight: 600; font-size: 16px;">CHARUSAT Placement Prep Team</p>
                        <p style="margin: 0; color: #6b7280; font-size: 12px; line-height: 1.4;">
                            CHARUSAT University • Changa, Gujarat • India<br>
                            Placement Cell | Career Development Center<br>
                            <em>This is an automated message. Please do not reply to this email.</em>
                        </p>
                    </div>
                </div>
            </body>
            </html>
        `
    };

    try {
        const result = await transporter.sendMail(mailOptions);
        return { success: true, messageId: result.messageId };
    } catch (error) {
        console.error('Email sending failed:', error);
        return { success: false, error: error.message };
    }
};

module.exports = { sendCredentialEmail };