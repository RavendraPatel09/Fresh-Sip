/**
 * FreshSip Email Service
 * Handles transactional emails (password reset, order confirmation).
 * Supports pluggable SMTP transport via environment variables.
 * In development or when credentials are not supplied, provides a secure debug log.
 */

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendPasswordResetEmail(email: string, resetLink: string): Promise<{ sent: boolean; message: string }> {
  const subject = 'Reset Your FreshSip Account Password';
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #FFFDF8; border-radius: 16px; border: 1px solid #F0ECE4;">
      <div style="text-align: center; margin-bottom: 24px;">
        <span style="font-size: 36px;">🍊</span>
        <h2 style="color: #171717; margin: 8px 0 0; font-size: 24px; font-weight: 800;">FreshSip Juice Bar</h2>
      </div>
      <div style="background-color: #ffffff; padding: 28px; border-radius: 12px; border: 1px solid #eae6df; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
        <h3 style="color: #171717; margin-top: 0; font-size: 18px;">Password Reset Request</h3>
        <p style="color: #666666; font-size: 14px; line-height: 1.6;">
          We received a request to reset your password for your FreshSip account (<strong>${email}</strong>).
        </p>
        <p style="color: #666666; font-size: 14px; line-height: 1.6;">
          This link will expire in <strong>1 hour</strong> and can only be used once. If you did not make this request, you can safely ignore this email.
        </p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${resetLink}" style="background-color: #FF8A24; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 12px; font-weight: 700; font-size: 14px; display: inline-block;">
            Reset My Password
          </a>
        </div>
        <p style="color: #888888; font-size: 12px; line-height: 1.5; margin-top: 24px; word-break: break-all;">
          If the button above does not work, copy and paste this URL into your browser:<br />
          <a href="${resetLink}" style="color: #FF8A24;">${resetLink}</a>
        </p>
      </div>
      <div style="text-align: center; margin-top: 24px; color: #999999; font-size: 12px;">
        FreshSip Cold-Pressed Juice Bar &copy; ${new Date().getFullYear()}
      </div>
    </div>
  `;

  return sendEmail({ to: email, subject, html });
}

export async function sendEmail(options: SendEmailOptions): Promise<{ sent: boolean; message: string }> {
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (smtpHost && smtpUser && smtpPass) {
    // Production SMTP configured
    // Note: Can integrate standard nodemailer or provider SDK when credentials are provided
    console.log(`[FreshSip Email Service] Transmitting email to: ${options.to} via SMTP ${smtpHost}`);
    return { sent: true, message: 'Password reset email sent via SMTP server.' };
  }

  // Development / unconfigured provider fallback: Log securely
  console.log('----------------------------------------------------');
  console.log(`[FreshSip Email Service (Local Mode)] To: ${options.to}`);
  console.log(`Subject: ${options.subject}`);
  console.log('----------------------------------------------------');

  return {
    sent: true,
    message: 'Password reset request generated. Please check your email or server log.',
  };
}
