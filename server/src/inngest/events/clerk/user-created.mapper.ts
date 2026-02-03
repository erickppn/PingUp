import { ClerkUserCreatedEventData } from "./schemas/user-created.schema";
import { CreateUserInput } from "../../../modules/users/users.schemas";

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