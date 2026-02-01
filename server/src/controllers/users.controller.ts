import { FastifyRequest, FastifyReply } from "fastify";
import { getAuth } from "@clerk/fastify";
import z from "zod";

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
    const { username: inputUsername, bio, location, full_name } = fields;

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

// Find users by username, email, location, name
export async function discoverUsers(request: FastifyRequest, reply: FastifyReply) {
  const searchQuerySchema = z.object({
    search_query: z.string()
  });

  try {
    const { userId } = getAuth(request);
    const { search_query } = searchQuerySchema.parse(request.query);

    const allUsers = await User.find({
      $or: [
        { username: new RegExp(search_query, 'i') },
        { email: new RegExp(search_query, 'i') },
        { full_name: new RegExp(search_query, 'i') },
        { location: new RegExp(search_query, 'i') },
      ]
    });

    const filteredUsers = allUsers.filter(user => user._id !== userId);

    reply.status(200).send({
      success: true,
      users: filteredUsers
    });
  } catch (error) {
    console.log(error);

    reply.status(401).send({ success: false, message: error });
  }
}

// Follow User
export async function followUser(request: FastifyRequest, reply: FastifyReply) {
  const followUserParamsSchema = z.object({
    id: z.string()
  });

  try {
    const { userId } = getAuth(request);
    const { id } = followUserParamsSchema.parse(request.params);

    const loggedUser = await User.findById(userId);

    if (!loggedUser) {
      return reply.status(404).send({
        success: false,
        message: "User not found"
      });
    }

    if (loggedUser?.following.includes(id)) {
      return reply.status(400).send({
        success: false,
        message: "You are already follwing this user"
      });
    }

    loggedUser.following.push(id);
    await loggedUser.save();

    const toUser = await User.findById(id);

    if (!toUser) {
      return reply.status(404).send({
        success: false,
        message: "User not found"
      });
    }

    toUser.followers.push(loggedUser._id);
    await toUser.save();

    reply.status(200).send({
      success: false,
      message: "Now you are following this user"
    })
  } catch (error) {
    console.log(error);

    reply.status(401).send({
      success: false,
      message: error
    });
  }
}

// Unfollow User
export async function unfollowUser(request: FastifyRequest, reply: FastifyReply) {
  const followUserInputSchema = z.object({
    id: z.string()
  });

  try {
    const { userId } = getAuth(request);
    const { id } = followUserInputSchema.parse(request.body);

    const loggedUser = await User.findById(userId);

    if (!loggedUser) {
      return reply.status(404).send({
        success: false,
        message: "User not found"
      });
    }

    loggedUser.following = loggedUser.following.filter(user => user !== userId);
    await loggedUser.save();

    const toUser = await User.findById(id);

    if (!toUser) {
      return reply.status(404).send({
        success: false,
        message: "User not found"
      });
    }

    toUser.followers = toUser.followers.filter(user => user !== userId);
    await toUser.save();

    reply.status(200).send({
      success: false,
      message: "You are no longer following this user"
    })
  } catch (error) {
    console.log(error);

    reply.status(401).send({
      success: false,
      message: error
    });
  }
}