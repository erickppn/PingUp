import { useState } from "react";
import Linkify from "linkify-react";
import "linkify-plugin-hashtag";

import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { BadgeCheck, Heart, MessageCircle, Share2 } from "lucide-react";

import type { Post } from "../../types/post";

import { dummyUserData } from "../../assets/assets";
import { Link } from "react-router-dom";

const LinkifyOptions = {
  render: {
    hashtag: ({ content }: { content: string }) => {
      return (
        <span className="text-indigo-600">
          {content}
        </span>
      );
    }
  }
};

export function PostCard({ post }: { post: Post }) {
  const [likes, setLikes] = useState(post.likes_count);
  const currentUser = dummyUserData;

  async function handleLike() {

  }

  return (
    <div className="bg-white rounded-xl shadow p-4 space-y-4 w-full max-w-2xl">
      <Link 
        to={`/profile/${post.user._id}`}
        className="inline-flex items-center gap-3 cursor-pointer">
        <img
          src={post.user.profile_picture}
          alt={`${post.user.username}'s avatar`}
          className="w-10 h-10 rounded-full shadow"
        />

        <div>
          <div className="flex items-center space-x-1">
            <span>{post.user.username}</span>
            <BadgeCheck className="w-4 h-4 text-blue-500" />
          </div>

          <div className="text-gray-500 text-sm">
            @{post.user.username} · {formatDistanceToNow(post.createdAt)}
          </div>
        </div>
      </Link>

      {/* Post content */}
      {post.content && (
        <div className="text-gray-800 text-sm whitespace-pre-line">
          <Linkify
            options={LinkifyOptions}
          >
            {post.content}
          </Linkify>
        </div>
      )}

      {/* Post image */}
      {(post.image_urls && post.image_urls.length > 0) && (
        <div className="grid grid-cols-2 gap-2">
          {post.image_urls.map((imgUrl, index) => (
            <img
              key={index}
              src={imgUrl}
              className={`w-full object-cover rounded-lg ${post.image_urls?.length === 1 && 'col-span-2'}`}
            />
          ))}
        </div>
      )}

      <div className="flex items-center gap-4 text-gray-600 text-sm pt-2 border-t border-gray-300">
        <div className="flex items-center gap-1">
          <Heart 
            className={`
              w-4 h-4 cursor-pointer
              ${likes.includes(currentUser._id) && 'text-red-500 fill-red-500'}
            `}
            onClick={handleLike}
          />

          <span>{likes.length}</span>
        </div>

        <div className="flex items-center gap-1">
          <MessageCircle className="w-4 h-4" />
          
          <span>{12}</span>
        </div>

        <div className="flex items-center gap-1">
          <Share2 className="w-4 h-4" />
          
          <span>{7}</span>
        </div>
      </div>
    </div>
  )
}
