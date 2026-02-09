import { User } from "@/modules/users/users.model";

export async function getUserDataService(userId: string | undefined) {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    throw error;
  }
}