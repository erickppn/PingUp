import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom";

import { Loading } from "../components/Loading";
import { UserProfileInfo } from "../components/UserProfileInfo";

import { dummyPostsData, dummyUserData } from "../assets/assets";

import type { Post } from "../types/post";
import type { User } from "../types/user";
import { PostCard } from "../components/Posts/PostCard";
import { formatDistanceToNow } from "date-fns";

const TABS = ['posts', 'media', 'likes'] as const;

type TabLabel = typeof TABS[number]

export function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<TabLabel>("posts");
  const [showEdit, setShowEdit] = useState(false);

  const { profileId } = useParams();

  async function fetchUser() {
    setUser(dummyUserData);
    setPosts(JSON.parse(JSON.stringify(dummyPostsData)));
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return user ? (
    <div className="relative h-full overflow-y-scroll bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          {/* Cover Photo */}
          <div className="h-40 md:h-56 bg-linear-to-r from-indigo-200 via-purple-200 to-pink-200">
            {user.cover_photo && (
              <img src={user.cover_photo} className="w-full h-full object-cover"/>
            )}
          </div>

          {/*User Info*/}
          <UserProfileInfo posts={posts} profileId={profileId} setShowEdit={setShowEdit} user={user}/>
        </div>

        <div className="mt-6">
          <div className="bg-white rounded-xl shadow p-1 flex max-w-md mx-auto">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer
                  ${activeTab === tab ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:text-gray-900'}  
                `}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Posts */}
          {activeTab === 'posts' && (
            <div className="mt-6 flex flex-col items-center gap-6">
              {posts.map(post => (
                <PostCard key={post._id} post={post}/>
              ))}
            </div>
          )}

          {/* Media */}
          {activeTab === 'media' && (
            <div className="flex flex-wrap mt-6 max-w-6xl">
              {
                posts.filter(post => post.image_urls?.length > 0).map(post => (
                  <>
                    {post.image_urls.map((img, index) => (
                      <Link 
                        target="_blank"
                        to={img}
                        key={index}
                        className="relative group"
                      >
                        <img 
                          src={img} 
                          alt=""
                          className="w-64 aspect-video object-cover" 
                        />

                        <p className="absolute bottom-0 right-0 text-xs p-1 px-3 backdrop:blur-xl text-white opacity-0 group-hover:opacity-100 transition duration-300">
                          Posted {formatDistanceToNow(post.createdAt)}
                        </p>
                      </Link>
                    ))}
                  </>
                ))
              }
            </div>
          )}
        </div>
      </div>

      {showEdit && (
        <p>sadjsal</p>
      )}
    </div>
  ) : (
    <Loading />
  )
}