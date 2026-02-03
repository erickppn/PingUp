import { FastifyRequest, FastifyReply } from "fastify";
import { getAuth } from "@clerk/fastify";

import fs from "node:fs";

import { User } from "./users.model";

import { parseMultipart } from "../../utils/parse-multpart";

import { buildURL, uploadToImageKit } from "../../services/media/imagekit/imagekit.service";

import { 
  followUserParamsSchema, 
  searchUsersQuerySchema, 
  unfollowUserParamsSchema, 
  updateUserInputSchema 
} from "./users.schemas";

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
    const { fields, files } = await parseMultipart(request);

    const { username, full_name, bio, location } = updateUserInputSchema.parse(fields);
    const { userId } = getAuth(request);

    const tempUser = await User.findById(userId);

    if (!tempUser) {
      return reply.status(404).send({ success: false, message: "User not found" });
    }

    let newUsername = username;

    !newUsername && (newUsername = tempUser.username);

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

    // Update and upload the profile picture
    if (files.profile.length > 0) {
      const profilePic = files.profile[0];

      const uploadedImage = await uploadToImageKit({
        fieldname: profilePic.fieldname,
        filename: profilePic.filename,
        filePath: profilePic.tempPath
      });

      if (!uploadedImage || !uploadedImage.url) {
        return reply.status(400).send({
          success: false,
          message: "Error while trying to upload the profile image"
        });
      }

      const url = buildURL(uploadedImage.url, {
        transformation: [
          { quality: 90 },
          { format: 'webp' },
          { width: '512' }
        ]
      });

      newUserData.profile_picture = url;
      
      //delete the temp file
      fs.unlink(profilePic.tempPath, (error) => {
        if (error) console.log(error);
      });
    }

    // Update the cover picture
    if (files.cover.length > 0) {
      const coverPic = files.cover[0];

      const uploadedImage = await uploadToImageKit({
        fieldname: coverPic.fieldname,
        filename: coverPic.filename,
        filePath: coverPic.tempPath
      });

      if (!uploadedImage || !uploadedImage.url) {
        return reply.status(400).send({
          success: false,
          message: "Error while trying to upload the cover image"
        });
      }

      const url = buildURL(uploadedImage.url, {
        transformation: [
          { quality: 90 },
          { format: 'webp' },
          { width: '1280' }
        ]
      });

      newUserData.cover_photo = url;

      //delete the temp file
      fs.unlink(coverPic.tempPath, (error) => {
        if (error) console.log(error);
      });
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
  try {
    const { userId } = getAuth(request);
    const { search_query } = searchUsersQuerySchema.parse(request.query);

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

    const tofollowUser = await User.findById(id);

    if (!tofollowUser) {
      return reply.status(404).send({
        success: false,
        message: "User not found"
      });
    }

    tofollowUser.followers.push(loggedUser._id);
    await tofollowUser.save();

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
  try {
    const { userId } = getAuth(request);
    const { id } = unfollowUserParamsSchema.parse(request.params);

    const loggedUser = await User.findById(userId);

    if (!loggedUser) {
      return reply.status(404).send({
        success: false,
        message: "User not found"
      });
    }

    loggedUser.following = loggedUser.following.filter(user => user !== id);
    await loggedUser.save();

    const toUnfollowUser = await User.findById(id);

    if (!toUnfollowUser) {
      return reply.status(404).send({
        success: false,
        message: "User not found"
      });
    }

    toUnfollowUser.followers = toUnfollowUser.followers.filter(user => user !== userId);
    await toUnfollowUser.save();

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