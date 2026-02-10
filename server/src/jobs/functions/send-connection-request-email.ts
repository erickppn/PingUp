import { inngest } from "@/jobs/client";
import { EVENTS } from "@/jobs/events";

import { Connection } from "@/modules/connections/connections.model";
import { User } from "@/modules/users/users.model";

import { sendMail } from "@/shared/providers/email/nodemailer/nodemailer.provider";
import { connectionReminderTemplate } from "@/shared/providers/email/templates/connection-reminder.template";
import { connectionRequestTemplate } from "@/shared/providers/email/templates/connection-request.template";

export const sendConnectionRequestEmail = inngest.createFunction(
  {
    id: 'send-connection-request-email',
    cancelOn: [{ event: EVENTS.CONNECTION_ACEPPTED }]
  },

  { event: EVENTS.CONNECTION_REQUESTED },

  async ({ event, step }) => {
    const connection = await Connection.findById(event.data.connectionId);
    if (!connection || connection.accepted) return;

    const sender = await User.findById(connection.from_user_id);
    const receiver = await User.findById(connection.to_user_id);

    if (!receiver || !sender) return;

    await step.run('send-connection-request-email', async () => {
      const { html, subject } = connectionRequestTemplate({
        fromUsername: sender.username,
        fromName: sender.full_name,
        frontendUrl: process.env.FRONTEND_URL!,
        toName: receiver.full_name,
        profile_picture: sender.profile_picture
      });

      await sendMail({
        to: receiver.email,
        subject,
        body: html
      });
    });

    const in24Hours = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await step.sleepUntil('await-for-24-hours', in24Hours);

    await step.run('send-connection-request-reminder', async () => {
      const { html, subject } = connectionReminderTemplate({
        fromUsername: sender.username,
        fromName: sender.full_name,
        frontendUrl: process.env.FRONTEND_URL!,
        toName: receiver.full_name,
        profile_picture: sender.profile_picture
      });

      await sendMail({
        to: receiver.email,
        subject,
        body: html
      });
    });
  }
)