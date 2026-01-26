export interface User {
  _id: string;
  email: string;
  full_name: string;
  username: string;
  bio: string;
  profile_picture: string;
  cover_photo: string;
  location: string;
  followers: string[];
  following: string[];
  connections: string[];
  posts: string[];
  is_verified: boolean;
  createdAt: string;
  updatedAt: string;
}