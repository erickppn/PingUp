import { clerkUserCreation } from "@/jobs/functions/clerk-user-creation"; 
import { clerkUserDeletion } from "@/jobs/functions/clerk-user-deletion";
import { clerkUserUpdation } from "@/jobs/functions/clerk-user-updation";
import { sendConnectionRequestEmail } from "@/jobs/functions/send-connection-request-email";
import { expireStory } from "@/jobs/functions/expire-story";
import { sendUnreadEmailFunction } from "@/jobs/functions/send-unreal-messages-email";
import { dailyUnreadCron } from "@/jobs/functions/cron/daily-unread-cron";

export const functions = [
  clerkUserCreation,
  clerkUserUpdation,
  clerkUserDeletion,
  sendConnectionRequestEmail,
  expireStory,
  sendUnreadEmailFunction,
  dailyUnreadCron
];