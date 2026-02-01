import { FastifyRequest, FastifyReply } from "fastify";
import { getAuth } from "@clerk/fastify";

import { updateUserInputSchema } from "../schemas/user.schemas";

import { User } from "../models/User";

import { parseMultipart } from "../utils/parse-multpart";

import { uploadToImageKit as fileUploader } from "../services/media/imagekit/imagekit.service";
import { buildURL } from "../services/media/imagekit/imagekit.service";


export async function getUserData(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { userId } = getAuth(request);

    const user = await User.findById(userId);

    if (!user) {
      return reply.status(404).send({ success: false, message: "User not found" });
    }

    reply.status(200).send({ success: false, user });
  } catch (error) {
    console.log(error);

    reply.status(401).send({ success: false, message: error });
  }
}

export async function updateUserData(request: FastifyRequest, reply: FastifyReply) {
  try {
    const parsedFields = await parseMultipart(
      request, 
      fileUploader
    );

    const { fields, files } = updateUserInputSchema.parse(parsedFields);
    const { username: inputUsername , bio, location, full_name } = fields;

    const { userId } = getAuth(request);

    const tempUser = await User.findById(userId);

    if (!tempUser) {
      return reply.status(404).send({ success: false, message: "User not found" });
    }

    let newUsername = inputUsername;

    !newUsername && (newUsername = tempUser?.username);

    if (tempUser.username !== newUsername) {
      const user = await User.findOne({ username: newUsername });

      if (user) {
        // we will not change the username if it is already taken
        newUsername = tempUser.username;
      }
    }

    const newUserData = {
      username: newUsername,
      bio,
      location,
      full_name,
      profile_picture: tempUser.profile_picture,
      cover_photo: tempUser.cover_photo
    }

    // Update the profile picture
    if (files.profile) {
      const url = buildURL(files.profile[0].url, {
        transformation: [
          { quality: 90 },
          { format: 'webp' },
          { width: '512' }
        ]
      });   

      newUserData.profile_picture = url;
    }

    // Update the cover picture
    if (files.cover) {
      const url = buildURL(files.cover[0].url, {
        transformation: [
          { quality: 90 },
          { format: 'webp' },
          { width: '1280' }
        ]
      });

      newUserData.cover_photo = url;
    }

    const user = await User.findByIdAndUpdate(userId, newUserData, { new: true });

    reply.status(200).send({ success: true, user, message: "Profile updated successfully" });
  } catch (error) {
    console.log(error);

    reply.status(401).send({ success: false, message: error });
  }
}