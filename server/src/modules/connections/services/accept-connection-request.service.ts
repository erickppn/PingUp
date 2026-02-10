import { User } from "@/modules/users/users.model";
import { Connection } from "@/modules/connections/connections.model";

import { inngest } from "@/jobs/client";
import { EVENTS } from "@/jobs/events";

type AcceptConnectionParams = {
  loggedUserId: string,
  toConnectUserId: string
}

export async function acceptConnectionRequestService({ loggedUserId, toConnectUserId }: AcceptConnectionParams) {
  const loggedUser = await User.findById(loggedUserId, { _id: true, connections: true });

  if (!loggedUser) {
    throw new Error("User not found");
  }

  const toConnectUser = await User.findById(toConnectUserId);

  if (!toConnectUser) {
    throw new Error("User not found");
  }

  const connection = await Connection.findOne({
    from_user_id: toConnectUser._id,
    to_user_id: loggedUser._id
  });

  if (!connection) {
    throw new Error("This connection not found");
  }

  loggedUser.connections.push(toConnectUser._id);
  await loggedUser.save();

  toConnectUser.connections.push(loggedUser._id);
  await toConnectUser.save();

  connection.accepted = true;
  await connection.save();

  await inngest.send({
    name: EVENTS.CONNECTION_ACEPPTED,
    data: {
      connectionId: connection._id.toString()
    },
    id: connection._id.toString()
  });
}