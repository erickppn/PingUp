export type Message = {
  _id: string,
  from_user_id: string,
  to_user_id: string,
  text: string,
  message_type: "text" | "image" | "video",
  media_url: string,
  seen: boolean,
  createdAt: string,
  updatedAt: string,
}