const nodemailer = require('nodemailer');

/**
 * Email Service for sending verification emails via Mailtrap SMTP
 * 
 * Academic Note: This service handles all email-related functionality.
 * We use Mailtrap SMTP for testing emails in development without sending real emails.
 * 
 * Using nodemailer with SMTP is simpler and more reliable than the Mailtrap API.
 */

// Create SMTP transporter
const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST || 'sandbox.smtp.mailtrap.io',
    port: parseInt(process.env.MAILTRAP_PORT || '2525'),
    auth: {
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD
    }
});

/**
 * Send email verification link to user
 * 
 * @param {string} email - User's email address
 * @param {string} verificationToken - Unique verification token
 * @param {string} name - User's name for personalization
 * @returns {Promise<void>}
 */
const sendVerificationEmail = async (email, verificationToken, name) => {
    try {
        const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

        // Academic Note: We create a professional HTML email template
        // with clear instructions and a prominent verification button
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {
                        font-family: 'Arial', sans-serif;
                        line-height: 1.6;
                        color: #333;
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                    }
                    .header {
                        background: linear-gradient(135deg, #005596 0%, #0077cc 100%);
                        color: white;
                        padding: 30px;
                        text-align: center;
                        border-radius: 10px 10px 0 0;
                    }
                    .content {
                        background: #f8f9fa;
                        padding: 30px;
                        border-radius: 0 0 10px 10px;
                    }
                    .button {
                        display: inline-block;
                        background: #005596;
                        color: white;
                        padding: 15px 30px;
                        text-decoration: none;
                        border-radius: 8px;
                        margin: 20px 0;
                        font-weight: bold;
                    }
                    .footer {
                        text-align: center;
                        margin-top: 30px;
                        color: #666;
                        font-size: 12px;
                    }
                    .warning {
                        background: #fff3cd;
                        border-left: 4px solid #ffc107;
                        padding: 15px;
                        margin: 20px 0;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Welcome to AixMarseilleEvents!</h1>
                </div>
                <div class="content">
                    <p>Hello <strong>${name}</strong>,</p>
                    
                    <p>Thank you for registering with AixMarseilleEvents, the official event platform for Aix-Marseille University.</p>
                    
                    <p>To complete your registration and start discovering campus events, please verify your email address by clicking the button below:</p>
                    
                    <div style="text-align: center;">
                        <a href="${verificationUrl}" class="button" style="background-color: #005596; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; border: 1px solid #005596;">Verify Email Address</a>
                    </div>
                    
                    <p>Or copy and paste this link into your browser:</p>
                    <p style="word-break: break-all; background: white; padding: 10px; border-radius: 5px;">
                        ${verificationUrl}
                    </p>
                    
                    <div class="warning">
                        <strong>⏰ Important:</strong> This verification link will expire in 24 hours.
                    </div>
                    
                    <p>If you didn't create an account with AixMarseilleEvents, please ignore this email.</p>
                    
                    <p>Best regards,<br>
                    <strong>The AixMarseilleEvents Team</strong></p>
                </div>
                <div class="footer">
                    <p>© 2026 Aix-Marseille University. All rights reserved.</p>
                    <p>This is an automated email. Please do not reply.</p>
                </div>
            </body>
            </html>
        `;

        // Send email via SMTP
        const info = await transporter.sendMail({
            from: `"${process.env.MAILTRAP_SENDER_NAME || 'AixMarseilleEvents'}" <${process.env.MAILTRAP_SENDER_EMAIL || 'hello@demomailtrap.com'}>`,
            to: email,
            subject: 'Verify Your Email - AixMarseilleEvents',
            html: htmlContent
        });

        console.log(`✅ Verification email sent to ${email} (Message ID: ${info.messageId})`);
    } catch (error) {
        console.error('❌ Failed to send verification email:', error);
        // For development, log the error but don't fail registration
        // In production, you would want to handle this differently
        console.log('⚠️  Continuing registration despite email error (development mode)');
    }
};

/**
 * Send password reset email (for future implementation)
 * 
 * Academic Note: Placeholder for password reset functionality
 * This follows the same pattern as email verification
 */
const sendPasswordResetEmail = async (email, resetToken, name) => {
    // TODO: Implement password reset email
    console.log('Password reset email not yet implemented');
};



/**
 * Send notification to admins when a new event is created
 */
const sendNewEventNotification = async (event, creator, adminEmails) => {
    try {
        const adminList = adminEmails.join(', ');
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="background-color: #005596; color: white; padding: 20px; text-align: center;">
                    <h1>New Event Created</h1>
                </div>
                <div style="padding: 20px;">
                    <p>Hello Admin,</p>
                    <p>A new event has been created by <strong>${creator.name}</strong> (${creator.email}).</p>
                    
                    <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #005596; margin: 20px 0;">
                        <h3>${event.title}</h3>
                        <p><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}</p>
                        <p><strong>Location:</strong> ${event.location}</p>
                        <p><strong>Capacity:</strong> ${event.maxSpots} spots</p>
                    </div>
                    
                    <p>Please review it in the admin dashboard.</p>
                </div>
            </body>
            </html>
        `;

        await transporter.sendMail({
            from: `"${process.env.MAILTRAP_SENDER_NAME}" <${process.env.MAILTRAP_SENDER_EMAIL}>`,
            to: adminList,
            subject: `New Event: ${event.title}`,
            html: htmlContent
        });
        console.log(`✅ New event notification sent to admins: ${adminList}`);
    } catch (error) {
        console.error('❌ Failed to send new event notification:', error);
    }
};

/**
 * Send notification to organizer when a new user registers
 */
const sendNewRegistrationNotification = async (event, user, organizerEmail) => {
    try {
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="background-color: #FDC500; color: #333; padding: 20px; text-align: center;">
                    <h1>New Registration!</h1>
                </div>
                <div style="padding: 20px;">
                    <p>Great news! A new user has registered for your event.</p>
                    
                    <p><strong>Event:</strong> ${event.title}</p>
                    <p><strong>Attendee:</strong> ${user.name} (${user.email})</p>
                    
                    <p>Keep up the great work!</p>
                </div>
            </body>
            </html>
        `;

        await transporter.sendMail({
            from: `"${process.env.MAILTRAP_SENDER_NAME}" <${process.env.MAILTRAP_SENDER_EMAIL}>`,
            to: organizerEmail,
            subject: `New Registration for ${event.title}`,
            html: htmlContent
        });
        console.log(`✅ New registration notification sent to organizer: ${organizerEmail}`);
    } catch (error) {
        console.error('❌ Failed to send registration notification:', error);
    }
};

/**
 * Send notification to participants when event is updated
 */
const sendEventUpdateNotification = async (event, changes, participantEmails, adminEmails) => {
    if (!participantEmails.length && !adminEmails.length) return;

    try {
        const changesHtml = changes.map(change => `<li>${change}</li>`).join('');

        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="background-color: #005596; color: white; padding: 20px; text-align: center;">
                    <h1>Event Update</h1>
                </div>
                <div style="padding: 20px;">
                    <p>Hello,</p>
                    <p>The event <strong>${event.title}</strong> has been updated.</p>
                    
                    <div style="background-color: #fff3cd; padding: 15px; border-left: 4px solid #FDC500; margin: 20px 0;">
                        <h3>What Changed?</h3>
                        <ul>
                            ${changesHtml}
                        </ul>
                    </div>

                    <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #005596; margin: 20px 0;">
                        <h3>Current Event Details</h3>
                        <p><strong>Date:</strong> ${new Date(event.date).toLocaleString('fr-FR')}</p>
                        <p><strong>Location:</strong> ${event.location}</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        // Notify Participants
        if (participantEmails.length > 0) {
            await transporter.sendMail({
                from: `"${process.env.MAILTRAP_SENDER_NAME}" <${process.env.MAILTRAP_SENDER_EMAIL}>`,
                bcc: participantEmails.join(', '),
                subject: `Update: ${event.title}`,
                html: htmlContent
            });
            console.log(`✅ Event update notification sent to ${participantEmails.length} participants`);
        }

        // Notify Admins
        if (adminEmails.length > 0) {
            await transporter.sendMail({
                from: `"${process.env.MAILTRAP_SENDER_NAME}" <${process.env.MAILTRAP_SENDER_EMAIL}>`,
                bcc: adminEmails.join(', '),
                subject: `[Admin] Event Update: ${event.title}`,
                html: htmlContent
            });
            console.log(`✅ Admin notification sent to ${adminEmails.length} admins`);
        }
    } catch (error) {
        console.error('❌ Failed to send event update notification:', error);
    }
};

module.exports = {
    sendVerificationEmail,
    sendPasswordResetEmail,
    sendNewEventNotification,
    sendNewRegistrationNotification,
    sendEventUpdateNotification
};
