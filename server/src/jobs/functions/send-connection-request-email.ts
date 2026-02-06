import { inngest } from "@/jobs/client";
import { EVENTS } from "@/jobs/events";

import { sendConnectionRequestEmail as sendConnectionRequestEmailController } from "@/modules/connections/connections.controller";

export const sendConnectionRequestEmail = inngest.createFunction(
  { 
    id: 'send-connection-request-email', 
    cancelOn: [{ event: EVENTS.CONNECTION_ACEPPTED }]
  },

  { event: EVENTS.CONNECTION_REQUESTED },

  async ({ event, step }) => {
    const { connectionId } = event.data;

    await step.run('send-connection-request-email', async () => {
      await sendConnectionRequestEmailController(connectionId);
    });

    const in24Hours = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await step.sleepUntil('await-for-24-hours', in24Hours);

    await step.run('send-connection-request-reminder', async () => {
      await sendConnectionRequestEmailController(connectionId);
    });
  }
)