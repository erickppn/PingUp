import { User } from "@/modules/users/users.model";
import { Connection } from "@/modules/connections/connections.model";

import { inngest } from "@/jobs/client";
import { EVENTS } from "@/jobs/events";

import { TargetUserNotFoundError, UserNotFoundError } from "@/shared/errors/user/not-found.error";
import { AlreadyConnectedError, ConnectionRequestLimitError, ConnectionRequestPendingError } from "@/shared/errors/user/connection.error";

type CreateConnectionParams = {
  loggedUserId: string,
  toConnectUserId: string
}

export async function createConnectionRequestService({ loggedUserId, toConnectUserId }: CreateConnectionParams) {
  const loggedUser = await User.findById(loggedUserId, { _id: true });

  if (!loggedUser) {
    throw new UserNotFoundError();
  }

  // Verify that the user who will receive the request exists.
  const toConnectUser = await User.findById(toConnectUserId, { _id: true });

  if (!toConnectUser) {
    throw new TargetUserNotFoundError("connect");
  }

  // Check if user has sent more than 20 connection requetes in the last 24 hours
  const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const connectionRequests = await Connection.find({
    from_user_id: loggedUser._id,
    createdAt: { $gt: last24Hours }
  });

  if (connectionRequests.length > 20) {
    throw new ConnectionRequestLimitError();
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
    throw new AlreadyConnectedError();
  }

  if (connection) {
    throw new ConnectionRequestPendingError();
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
}