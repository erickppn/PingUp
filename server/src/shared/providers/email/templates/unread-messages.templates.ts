type UnreadMessagesTemplateProps = {
  toName: string
  unreadCount: number
  frontendUrl: string
}

export function unreadMessagesTemplate({
  toName,
  unreadCount,
  frontendUrl,
}: UnreadMessagesTemplateProps) {
  return {
    subject: `You have ${unreadCount} unread message${unreadCount > 1 ? 's' : ''} 💬`,
    html: `
      <div
        style="
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          font-family: Inter, Arial, Helvetica, sans-serif;
          color: #111827;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid #e5e7eb;
        "
      >
        <!-- Header -->
        <div
          style="
            padding: 24px;
            background: linear-gradient(135deg, #6d5df6, #8b5cf6);
            color: #ffffff;
          "
        >
          <h1 style="margin: 0; font-size: 22px;">💬 PingUp</h1>
          <p style="margin: 6px 0 0; font-size: 13px; opacity: 0.9;">
            Don’t miss important conversations
          </p>
        </div>

        <!-- Body -->
        <div style="padding: 24px;">
          <h2 style="margin-top: 0; font-size: 18px;">
            Hi ${toName},
          </h2>

          <p style="font-size: 14px; line-height: 1.6; color: #374151;">
            You currently have 
            <strong>${unreadCount} unread message${unreadCount > 1 ? 's' : ''}</strong>.
          </p>

          <p style="font-size: 14px; line-height: 1.6; color: #374151;">
            Open PingUp to read and reply before you miss something important.
          </p>

          <!-- CTA -->
          <div style="text-align: center; margin: 28px 0;">
            <a
              href="${frontendUrl}/messages"
              style="
                display: inline-block;
                background-color: #6d5df6;
                color: #ffffff;
                text-decoration: none;
                padding: 12px 22px;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 600;
              "
            >
              View messages
            </a>
          </div>

          <p style="font-size: 13px; color: #6b7280;">
            If you’ve already read them, you can ignore this email.
          </p>
        </div>

        <!-- Footer -->
        <div
          style="
            padding: 16px;
            background-color: #f8fafc;
            text-align: center;
            font-size: 12px;
            color: #6b7280;
          "
        >
          © ${new Date().getFullYear()} PingUp
        </div>
      </div>
    `
  }
}