import { clerkUserCreation } from "@/jobs/functions/clerk-user-creation"; 
import { clerkUserDeletion } from "@/jobs/functions/clerk-user-deletion";
import { clerkUserUpdation } from "@/jobs/functions/clerk-user-updation";

export const functions = [
  clerkUserCreation,
  clerkUserUpdation,
  clerkUserDeletion
];