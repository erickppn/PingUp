import { User } from "@/modules/users/users.model";

type DiscoverUsersParams = {
  query: string,
  excluideUserId: string
}

export async function discoverUsersQuery({ query, excluideUserId }: DiscoverUsersParams) {
  const allUsers = await User.find({
    $or: [
      { username: new RegExp(query, 'i') },
      { email: new RegExp(query, 'i') },
      { full_name: new RegExp(query, 'i') },
      { location: new RegExp(query, 'i') },
    ]
  });

  return allUsers.filter(user => user._id !== excluideUserId);
}