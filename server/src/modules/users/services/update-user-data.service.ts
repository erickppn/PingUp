import { UpdateUserInput, updateUserInputSchema } from "@/modules/users/users.schemas";
import { User } from "@/modules/users/users.model";

export async function updateUserDataService(data: UpdateUserInput) {
  try {
    const { id, email, full_name, image_url } = updateUserInputSchema.parse(data);

    // Verify if the user exists
    const existingUser = await User.findById(id);

    if (!existingUser) {
      throw new Error("User not exists");
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
  } catch (error) {
    console.log(error);
    throw error;
  }
}