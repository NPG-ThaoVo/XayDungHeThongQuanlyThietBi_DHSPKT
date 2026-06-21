import nodemailer from "nodemailer";

type EmailPayload = {
  to: string;
  subject: string;
  body: string;
};

function createTransporter() {
  const host = process.env.SMTP_HOST;
  if (!host) return null;

  return nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT ?? "587"),
    secure: process.env.SMTP_PORT === "465",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export async function sendEmail({ to, subject, body }: EmailPayload) {
  const transporter = createTransporter();

  if (!transporter) {
    console.log("[Email stub — SMTP_HOST not set]", { to, subject });
    return { ok: true };
  }

  await transporter.sendMail({
    from: process.env.SMTP_FROM ?? `"QLTHIETBI" <noreply@dhspkt.edu.vn>`,
    to,
    subject,
    html: body,
  });

  return { ok: true };
}

export function buildPasswordResetEmail(resetUrl: string, userName?: string) {
  const displayName = userName ?? "bạn";
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
      <h2 style="color: #0d9488;">Đặt lại mật khẩu</h2>
      <p>Xin chào <strong>${displayName}</strong>,</p>
      <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn tại Hệ thống Quản lý Thiết bị DHSPKT.</p>
      <p>Nhấn vào nút bên dưới để tạo mật khẩu mới. Liên kết có hiệu lực trong <strong>1 giờ</strong>.</p>
      <p style="margin: 32px 0;">
        <a href="${resetUrl}"
           style="background-color: #0d9488; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
          Đặt lại mật khẩu
        </a>
      </p>
      <p style="color: #6b7280; font-size: 14px;">
        Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này. Mật khẩu của bạn sẽ không thay đổi.
      </p>
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
      <p style="color: #9ca3af; font-size: 12px;">
        Hệ thống Quản lý Thiết bị — Khoa Công nghệ số, ĐHSPKT
      </p>
    </div>
  `;
}
