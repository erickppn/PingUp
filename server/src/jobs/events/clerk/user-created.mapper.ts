import { CreateUserInput } from "@/modules/users/users.schemas";
import { ClerkUserCreatedEventData } from "@/jobs/events/clerk/schemas/user-created.schema";

export function mapClerkUserCreatedtoDomain(
  data: ClerkUserCreatedEventData
): CreateUserInput {
  return {
    id: data.id,
    email: data.email_addresses[0].email_address,
    full_name: data.first_name + " " + data.last_name,
    image_url: data.image_url
  }
}