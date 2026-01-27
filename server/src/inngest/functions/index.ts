import { clerkUserCreation } from "./clerk-user-creation"; 
import { clerkUserDeletion } from "./clerk-user-deletion";
import { clerkUserUpdation } from "./clerk-user-updation";

export const functions = [
  clerkUserCreation,
  clerkUserUpdation,
  clerkUserDeletion
];