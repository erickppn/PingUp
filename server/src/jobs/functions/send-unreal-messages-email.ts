import { inngest } from "@/jobs/client";
import { EVENTS } from "@/jobs/events";

import { User } from "@/modules/users/users.model";
import { sendMail } from "@/shared/providers/email/nodemailer/nodemailer.provider";

import { unreadMessagesTemplate } from "@/shared/providers/email/templates/unread-messages.templates";

export const sendUnreadEmailFunction = inngest.createFunction(
  { id: 'send-unread-email' },
  { event: EVENTS.NOTIFICATIONS_SEND_UNREAD_EMAIL },
  async ({ event, step }) => {
    const user = await User.findById(event.data.userId);

    if (!user) return;

    await step.run('send-email', async () => {
      const { subject, html } = unreadMessagesTemplate({
        toName: user.full_name,
        frontendUrl: process.env.FRONTEND_URL!,
        unreadCount: event.data.count
      });

      await sendMail({
        to: user.email,
        subject,
        body: html
      });
    });
  }
)