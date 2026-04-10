const nodemailer = require('nodemailer');

/**
 * Service gửi Test Report qua email.
 * Sử dụng Gmail SMTP với App Password.
 * Cấu hình: tạo file .env với GMAIL_USER và GMAIL_APP_PASSWORD
 */
const sendTestReport = async ({ toEmail, testResults, totalPass, totalFail, totalBug }) => {
  // Guard: kiểm tra credentials trước khi tạo transporter
  const gmailUser = process.env.GMAIL_USER || 'phamcuong219@gmail.com';
  const gmailPass = process.env.GMAIL_APP_PASSWORD;
  if (!gmailPass) {
    throw new Error('[emailService] GMAIL_APP_PASSWORD chưa được cấu hình trong .env — không thể gửi email.');
  }

  // Tạo transporter — dùng Gmail SMTP
  // Để hoạt động: bật "2-Step Verification" trên Gmail, sau đó tạo "App Password"
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: gmailUser,
      pass: gmailPass,
    },
  });

  const statusIcon = totalFail + totalBug === 0 ? '✅' : '⚠️';
  const now = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });

  const htmlBody = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 640px; margin: 0 auto; background: #f8fafc; padding: 24px; border-radius: 12px;">
      <div style="background: #0071ff; color: white; padding: 20px 24px; border-radius: 8px; margin-bottom: 24px;">
        <h1 style="margin:0; font-size: 20px;">🧪 Báo cáo Kiểm thử Tự động</h1>
        <p style="margin: 4px 0 0; opacity: 0.85; font-size: 14px;">Gia phả Họ Phạm — ${now}</p>
      </div>

      <div style="display: flex; gap: 12px; margin-bottom: 20px;">
        <div style="flex:1; background: #dcfce7; border-radius: 8px; padding: 16px; text-align: center;">
          <div style="font-size: 28px; font-weight: 700; color: #16a34a;">${totalPass}</div>
          <div style="font-size: 13px; color: #15803d; font-weight: 500;">✅ PASS</div>
        </div>
        <div style="flex:1; background: #fee2e2; border-radius: 8px; padding: 16px; text-align: center;">
          <div style="font-size: 28px; font-weight: 700; color: #dc2626;">${totalFail}</div>
          <div style="font-size: 13px; color: #b91c1c; font-weight: 500;">❌ FAIL</div>
        </div>
        <div style="flex:1; background: #fef3c7; border-radius: 8px; padding: 16px; text-align: center;">
          <div style="font-size: 28px; font-weight: 700; color: #d97706;">${totalBug}</div>
          <div style="font-size: 13px; color: #b45309; font-weight: 500;">⚠️ BUG</div>
        </div>
      </div>

      <div style="background: white; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden; margin-bottom: 20px;">
        <div style="background: #f1f5f9; padding: 12px 16px; font-weight: 600; font-size: 14px; color: #334155;">
          Chi tiết kết quả test
        </div>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="background: #f8fafc; border-bottom: 1px solid #e2e8f0;">
            <th style="padding: 10px 16px; text-align: left; font-size: 13px; color: #64748b;">Test Case</th>
            <th style="padding: 10px 16px; text-align: center; font-size: 13px; color: #64748b;">Trạng thái</th>
            <th style="padding: 10px 16px; text-align: left; font-size: 13px; color: #64748b;">Ghi chú</th>
          </tr>
          ${testResults.map(tc => `
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 16px; font-size: 13px; color: #1e293b;">${tc.name}</td>
              <td style="padding: 10px 16px; text-align: center; font-size: 18px;">${tc.status === 'pass' ? '✅' : tc.status === 'fail' ? '❌' : '⚠️'}</td>
              <td style="padding: 10px 16px; font-size: 12px; color: #64748b;">${tc.note || '—'}</td>
            </tr>
          `).join('')}
        </table>
      </div>

      <p style="font-size: 12px; color: #94a3b8; margin-top: 16px;">
        Báo cáo tự động từ hệ thống @Tester Agent — Gia phả Họ Phạm
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: `"@Tester Agent - Gia Phả" <${process.env.GMAIL_USER || 'phamcuong219@gmail.com'}>`,
    to: toEmail,
    subject: `${statusIcon} Test Report: ${totalPass} PASS / ${totalFail} FAIL / ${totalBug} BUG — ${now}`,
    html: htmlBody,
  });

  console.log(`[📧] Test report đã gửi đến ${toEmail}`);
};

module.exports = { sendTestReport };
