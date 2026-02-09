import { User } from "@/modules/users/users.model";

export async function deleteUserService(id: string) {
  // Verify if the user exists
  const existingUser = await User.findById(id);

  if (!existingUser) {
    throw new Error("User not exists");
  }

  await User.findOneAndDelete({
    _id: id,
  });
}