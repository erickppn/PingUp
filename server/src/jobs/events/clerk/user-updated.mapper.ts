import { UpdateUserInput } from "@/modules/users/users.schemas";
import { ClerkUserUpdatedEventData } from "@/jobs/events/clerk/schemas/user-updated.schema";

export function mapClerkUserUpdatedtoDomain(
  data: ClerkUserUpdatedEventData
): UpdateUserInput {
  return {
    id: data.id,
    email: data.email_addresses[0].email_address,
    full_name: data.first_name + " " + data.last_name,
    image_url: data.image_url
  }
}