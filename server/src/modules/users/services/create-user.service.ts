import { CreateUserInput, createUserInputSchema } from "@/modules/users/users.schemas";
import { User } from "@/modules/users/users.model";

export async function createUserService(data: CreateUserInput) {
  try {
    const { id, email, full_name, image_url } = createUserInputSchema.parse(data);

    // Verify if the user already exists
    const existingUser = await User.findById(id);

    if (existingUser) {
      throw new Error("User already exists");
    }

    let username = email.split('@')[0];

    // Check availability of username
    const user = await User.findOne({
      username: username
    });

    if (user) {
      username = username + Math.floor(Math.random() * 1000);
    }

    const userData = {
      _id: id,
      email,
      full_name,
      profile_picture: image_url,
      username
    }

    await User.findOneAndUpdate({
      _id: id,
    }, userData, {
      upsert: true,
      new: true
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}