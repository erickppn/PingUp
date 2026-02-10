import { User } from "@/modules/users/users.model";
import { UserNotFoundError } from "@/shared/errors/user/not-found.error";

export async function deleteUserService(id: string) {
  // Verify if the user exists
  const existingUser = await User.findById(id);

  if (!existingUser) {
    throw new UserNotFoundError();
  }

  await User.findOneAndDelete({
    _id: id,
  });
}