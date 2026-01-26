import { useEffect, useRef, useState } from "react";
import { dummyMessagesData, dummyUserData } from "../assets/assets"
import type { User } from "../types/user";
import type { Message } from "../types/messages";
import { differenceInMilliseconds, formatDistanceToNow } from "date-fns";
import { ImageIcon, SendHorizonal } from "lucide-react";

export function ChatBox() {
  const [text, setText] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [user, setUser] = useState<User>(dummyUserData);
  const [messages, setMessages] = useState<Message[]>(JSON.parse(JSON.stringify(dummyMessagesData)));

  const messageEndRef = useRef<HTMLDivElement | null>(null);

  async function sendMessage() {

  }

  async function fetchMessages() {

  }

  function handleAddImage(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.length) return;

    setImage(e.target.files[0]);
  }

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages]);

  return user && (
    <div className="flex flex-col h-screen">
      <div className="flex items-center gap-2 p-2 md:px-10 xl:pl-42 bg-linear-to-r from-indigo-50 to-purple-50 border-b border-gray-300">
        <img src={user.profile_picture} alt="" className="size-8 rounded-full" />

        <div>
          <h1 className="font-medium">{user.full_name}</h1>

          <h2 className="text-sm text-gray-500 -mt-1.5">@{user.username}</h2>
        </div>
      </div>

      <div className="p-5 md:px-10 h-full overflow-y-scroll">
        <div className="space-y-4 max-w-4xl mx-auto">
          {
            messages.sort((a, b) => differenceInMilliseconds(a.createdAt, b.createdAt)).map(message => (
              <div
                key={message._id}
                className={`
                  flex flex-col group
                  ${message.to_user_id !== user._id ? 'items-start' : 'items-end'}
                `}
              >
                <div 
                  className={`
                    flex items-center gap-3
                    ${message.to_user_id === user._id && 'flex-row-reverse'}
                  `}
                >
                  <div
                    className={`
                      p-2 text-sm max-w-sm bg-white text-slate-700 rounded-lg shadow
                      ${message.to_user_id !== user._id ? 'rounded-bl-none' : 'rounded-br-none'}
                    `}
                  >
                    {message.message_type === 'image' && (
                      <img
                        src={message.media_url}
                        alt=""
                        className="w-full max-w-sm rounded-lg mb-1"
                      />
                    )}

                    <p>{message.text}</p>
                  </div>

                  <span className="text-xs text-slate-600 hidden group-hover:block">
                    {formatDistanceToNow(message.createdAt)}
                  </span>
                </div>
              </div>
            ))
          }

          <div ref={messageEndRef} />
        </div>
      </div>

      <div className="px-4">
        <div className="flex items-center gap-3 pl-5 p-1.5 bg-white w-full max-w-xl mx-auto border border-gray-200 shadow rounded-full mb-5">
          <input
            type="text"
            className="flex-1 outline-none text-slate-700"
            placeholder="Type a message..."
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            onChange={e => setText(e.target.value)}
            value={text}
          />

          <label htmlFor="image" className="cursor-pointer">
            {
              image
                ? <img src={URL.createObjectURL(image)} className="h-8 rounded" />
                : <ImageIcon className="size-7 text-gray-400" />
            }

            <input
              type="file"
              id="image"
              accept="image/*"
              hidden
              onChange={handleAddImage}
            />
          </label>

          <button
            onClick={sendMessage}
            className="bg-linear-to-br from-indigo-500 to-purple-600 active:scale-95 cursor-pointer text-white p-2 rounded-full"
          >
            <SendHorizonal size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}