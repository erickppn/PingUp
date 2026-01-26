import type { User } from "./user";

export interface Story {
  _id: string;
  user: User;
  content: string;
  media_url: string;
  media_type: 'text' | 'image' | 'video';
  background_color: string;
  createdAt: string;
  updatedAt: string;
}