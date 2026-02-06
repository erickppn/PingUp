import { FastifyRequest, FastifyReply } from "fastify";
import { getAuth } from "@clerk/fastify";

import { Connection } from "@/modules/connections/connections.model";
import { User } from "@/modules/users/users.model";

import { 
  acceptConnectionRequestParamsSchema, 
  connectionRequestParamsSchema 
} from "./connections.schema";

import { sendMail } from "@/shared/providers/email/nodemailer/nodemailer.provider";
import { connectionRequestTemplate } from "@/shared/providers/email/templates/connection-request.template";

import { inngest } from "@/jobs/client";
import { EVENTS } from "@/jobs/events";

// Send Connection Request
export async function sendConnectionRequest(request: FastifyRequest, reply: FastifyReply) {
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

    const newConnection = await Connection.create({
      from_user_id: loggedUser._id,
      to_user_id: toConnectUser._id
    });

    await inngest.send({
      name: EVENTS.CONNECTION_REQUESTED,
      data: {
        connectionId: newConnection._id.toString()
      },
      id: newConnection._id.toString()
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
  try {
    const { userId } = getAuth(request);
    const { id } = acceptConnectionRequestParamsSchema.parse(request.params);

    const loggedUser = await User.findById(userId, { _id: true, connections: true });

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

    await inngest.send({
      name: EVENTS.CONNECTION_ACEPPTED,
      data: {
        connectionId: connection._id.toString()
      },
      id: connection._id.toString()
    });

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

export async function sendConnectionRequestEmail(connectionId: string) {
  const connection = await Connection.findById(connectionId);

  if (!connection) {
    return new Error("This connection not exists");
  }

  if (connection.accepted) {
    return { message: "Already accepted" }
  }

  const receiver = await User.findById(connection.to_user_id);

  if (!receiver) {
    return new Error("This receiver not exists");
  }

  const sender = await User.findById(connection.from_user_id);

  if (!sender) {
    return new Error("This receiver not exists");
  }

  const FRONTEND_URL = process.env.FRONTEND_URL || "";

  await sendMail({
    to: receiver.email,
    subject: 'New Connection Request',

    body: connectionRequestTemplate({
      fromUsername: sender.username,
      fromName: sender.full_name,
      frontendUrl: FRONTEND_URL,
      toName: receiver.full_name
    })
  });
}