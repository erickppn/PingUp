import { FastifyRequest, FastifyReply } from "fastify";
import { getAuth } from "@clerk/fastify";
import z from "zod";

import { updateUserInputSchema } from "../schemas/user.schemas";

import { User } from "../models/User";

import { parseMultipart } from "../utils/parse-multpart";

import { uploadToImageKit as fileUploader } from "../services/media/imagekit/imagekit.service";
import { buildURL } from "../services/media/imagekit/imagekit.service";
import { Connection } from "../models/Connection";


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
  const unfollowUserParamsSchema = z.object({
    id: z.string()
  });

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

// Send Connection Request
export async function sendConnectionRequest(request: FastifyRequest, reply: FastifyReply) {
  const connectionRequestParamsSchema = z.object({
    id: z.string()
  });

  try {
    const { userId } = getAuth(request);
    const { id } = connectionRequestParamsSchema.parse(request.params);

    const loggedUser = await User.findById(userId, { _id: true });

    if (!loggedUser) {
      return reply.status(404).send({
        success: false,
        message: "User not found"
      });
    }

    // Verify that the user who will receive the request exists.
    const toConnectUser = await User.findById(id, { _id: true });

    if (!toConnectUser) {
      return reply.status(404).send({
        success: false,
        message: "User not found"
      });
    }

    // Check if user has sent more than 20 connection requetes in the last 24 hours
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const connectionRequests = await Connection.find({
      from_user_id: loggedUser._id,
      createdAt: { $gt: last24Hours }
    });

    if (connectionRequests.length > 20) {
      return reply.status(400).send({
        success: false,
        message: "You have sent more than 20 connection requests in last 24 hours"
      });
    }

    // Verify if the users are already connected
    const connection = await Connection.findOne({
      $or: [
        {
          from_user_id: loggedUser._id,
          to_user_id: toConnectUser._id
        },
        {
          from_user_id: toConnectUser._id,
          to_user_id: loggedUser._id
        },
      ]
    });

    if (connection && connection.accepted) {
      return reply.status(400).send({
        success: false,
        message: "you are already conneted with this user",
      });
    }

    if (connection) {
      return reply.status(400).send({
        success: false,
        message: "Connection request pending",
      });
    }

    await Connection.create({
      from_user_id: loggedUser._id,
      to_user_id: toConnectUser._id
    });

    reply.status(201).send({
      success: true,
      message: "Connection request sent successfully"
    });

  } catch (error) {
    console.log(error);

    reply.status(401).send({
      success: false,
      message: error
    });
  }
}

// Get user connections
export async function getUserConnections(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { userId } = getAuth(request);

    const loggedUser = await User.findById(userId).populate('connections followers following', '_id bio full_name profile_picture username');

    if (!loggedUser) {
      return reply.status(404).send({
        success: false,
        message: "User not found"
      });
    }

    const connections = loggedUser.connections;
    const followers = loggedUser.followers;
    const following = loggedUser.following;

    const pendingConnections = (await Connection.find({
      to_user_id: loggedUser._id,
      accepted: false,
    }).populate(
      'from_user_id',
      '_id bio full_name profile_picture username'
    )).map(connection => connection.from_user_id);

    reply.status(200).send({
      success: true,
      connections,
      followers,
      following,
      pendingConnections
    });

  } catch (error) {
    console.log(error);

    reply.status(401).send({
      success: false,
      message: error
    });
  }
}

// Accept connection request
export async function acepptConnectionRequest(request: FastifyRequest, reply: FastifyReply) {
  const acceptConnectionRequestParamsSchema = z.object({
    id: z.string()
  });

  try {
    const { userId } = getAuth(request);
    const { id } = acceptConnectionRequestParamsSchema.parse(request.params);

    const loggedUser = await User.findById(userId, { _id: true });

    if (!loggedUser) {
      return reply.status(404).send({
        success: false,
        message: "User not found"
      });
    }

    const toConnectuser = await User.findById(id);

    if (!toConnectuser) {
      return reply.status(404).send({
        success: false,
        message: "User not found"
      });
    }

    const connection = await Connection.findOne({
      from_user_id: toConnectuser._id,
      to_user_id: loggedUser._id
    });

    if (!connection) {
      return reply.status(400).send({
        success: false,
        message: "Connection not found"
      });
    }

    loggedUser.connections.push(toConnectuser._id);
    await loggedUser.save();

    toConnectuser.connections.push(loggedUser._id);
    await toConnectuser.save();

    connection.accepted = true;
    await connection.save();

    reply.status(200).send({
      success: true,
      message: "Connection accepted successfully"
    });

  } catch (error) {
    console.log(error);

    reply.status(401).send({
      success: false,
      message: error
    });
  }
}