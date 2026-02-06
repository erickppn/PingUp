type ConnectionRequestTemplateProps = {
  toName: string
  fromName: string
  fromUsername: string
  frontendUrl: string
}

export function connectionRequestTemplate({
  toName,
  fromName,
  fromUsername,
  frontendUrl,
}: ConnectionRequestTemplateProps) {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Hi ${toName},</h2>

      <p>
        You have a new connection request from
        ${fromName} - @${fromUsername}
      </p>

      <p>
        Click
        <a
          href="${frontendUrl}/connections"
          style="color: #10b981;"
        >
          here
        </a>
        to accept or reject the request
      </p>

      <br />

      <p>
        Thanks,<br />
        PingUp - Stay Connected
      </p>
    </div>
  `
}
