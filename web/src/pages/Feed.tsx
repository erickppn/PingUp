import { useEffect, useState } from "react";
import { assets, dummyPostsData } from "../assets/assets";

import { Loading } from "../components/Loading";

import type { Post } from "../types/post";
import { StoriesBar } from "../components/Storys/StoriesBar";
import { PostCard } from "../components/Posts/PostCard";
import { RecentMessages } from "../components/RecentMessages";
import { SponsoredCard } from "../components/SponsoredCard";

export function Feed() {
  const [feeds, setFeeds] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchFeeds() {
    await setFeeds(JSON.parse(JSON.stringify(dummyPostsData)));
    setLoading(false);
  }

  useEffect(() => {
    fetchFeeds();
  }, []);

  return !loading ? (
    <div className="h-full overflow-y-scroll no-scrollbar py-10 xl:pr-5 flex items-start justify-center xl:gap-8">
      {/* Stories and post list */}
      <div>
        <StoriesBar />

        <div className="p-4 space-y-6">
          {feeds.map((post) => (
            <PostCard key={post._id} post={post}/>
          ))}
        </div>
      </div>

      {/*Right sidebar */}
      <div className="max-xl:hidden max-w-xs sticky top-0 w-full">
        <SponsoredCard />

        <RecentMessages />
      </div>
    </div>
  ) : <Loading />
};