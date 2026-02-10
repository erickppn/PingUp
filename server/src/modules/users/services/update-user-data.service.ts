import { UpdateUserInput, updateUserInputSchema } from "@/modules/users/users.schemas";
import { User } from "@/modules/users/users.model";

import { UserNotFoundError } from "@/shared/errors/user/not-found.error";

export async function updateUserDataService(data: UpdateUserInput) {
  const { id, email, full_name, image_url } = updateUserInputSchema.parse(data);

  const existingUser = await User.findById(id);

  if (!existingUser) {
    throw new UserNotFoundError();
  }

  const updatedUserData = {
    _id: id,
    email,
    full_name,
    profile_picture: image_url,
  }

  await User.findOneAndUpdate({
    _id: id,
  }, updatedUserData);
}