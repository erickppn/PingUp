import { inngest } from "@/jobs/client";
import { EVENTS } from "@/jobs/events";

import { Message } from "@/modules/conversations/models/messages.model";

export const dailyUnreadCron = inngest.createFunction(
  { id: 'daily-unread-messages-cron'},
  { cron: 'TZ=America/New_York 0 9 * * *'},
  async ({ step }) => {
    const users = await step.run(
      'get-users-with-unread',
      async () => {
        return Message.aggregate([
          { $match: { read_at: null } },
          {
            $group: {
              _id: '$to_user_id',
              count: { $sum: 1 },
            },
          },
        ]);
      }
    )

    for (const user of users) {
      await step.sendEvent("send-unread-email-notification", {
        name: EVENTS.NOTIFICATIONS_SEND_UNREAD_EMAIL,
        data: {
          userId: user._id,
          count: user.count,
        },
      });
    }
  }
)