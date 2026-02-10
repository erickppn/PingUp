import { User } from "@/modules/users/users.model";
import { UserNotFoundError } from "@/shared/errors/user/not-found.error";

export async function getUserDataService(userId: string) {
  const user = await User.findById(userId);

  if (!user) {
    throw new UserNotFoundError();
  }

  return user;
}