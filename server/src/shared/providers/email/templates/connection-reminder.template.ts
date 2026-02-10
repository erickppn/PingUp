type ConnectionRequestTemplateProps = {
  toName: string
  fromName: string
  fromUsername: string
  frontendUrl: string
  profile_picture: string
}

export function connectionReminderTemplate({
  toName,
  fromName,
  fromUsername,
  frontendUrl,
  profile_picture
}: ConnectionRequestTemplateProps) {
  return {
    subject: `New Connection Request`,
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
          <h1 style="margin: 0; font-size: 22px;">⚡ PingUp</h1>
          <p style="margin: 6px 0 0; font-size: 13px; opacity: 0.9;">
            Stay connected with people that matter
          </p>
        </div>

        <!-- Body -->
        <div style="padding: 24px;">
          <h2 style="margin-top: 0; font-size: 18px;">
            Hi ${toName},
          </h2>

          <p style="font-size: 14px; line-height: 1.6; color: #374151;">
            Just a reminder — you still have a pending connection request on PingUp.
          </p>

          <!-- User card -->
          <div
            style="
              display: flex;
              align-items: center;
              background-color: #f8fafc;
              border-radius: 10px;
              padding: 16px;
              margin: 20px 0;
            "
          >
            <img
              src="${profile_picture}"
              alt="${fromName}"
              width="52"
              height="52"
              style="
                border-radius: 50%;
                object-fit: cover;
                margin-right: 14px;
              "
            />

            <div>
              <p style="margin: 0; font-weight: 600; font-size: 14px;">
                ${fromName}
              </p>
              <p style="margin: 2px 0 0; font-size: 13px; color: #6b7280;">
                @${fromUsername}
              </p>
            </div>
          </div>

          <p style="font-size: 14px; line-height: 1.6; color: #374151;">
            Open PingUp to accept or decline this connection request.
          </p>

          <!-- CTA -->
          <div style="text-align: center; margin: 28px 0;">
            <a
              href="${frontendUrl}/connections"
              style="
                display: inline-block;
                background-color: #8b5cf6;
                color: #ffffff;
                text-decoration: none;
                padding: 12px 22px;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 600;
              "
            >
              Review request
            </a>
          </div>

          <p style="font-size: 13px; color: #6b7280;">
            If you don’t recognize this request, you can safely ignore this email.
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
