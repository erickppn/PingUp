import { User } from "@/modules/users/users.model";
import { Connection } from "@/modules/connections/connections.model";

export async function getMyConnectionsService(userId: string) {
  const loggedUser = await User.findById(userId).populate('connections followers following', '_id bio full_name profile_picture username');

  if (!loggedUser) {
    throw new Error("User not found");
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

  return {
    connections,
    followers,
    following,
    pendingConnections
  }
}