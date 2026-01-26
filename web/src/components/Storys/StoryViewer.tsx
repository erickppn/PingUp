import { useEffect, useState } from "react";
import { BadgeCheck, X } from "lucide-react";

import type { Story } from "../../types/story";

interface StoryViewerProps {
  viewStory: Story | null;
  setViewStory: (story: Story | null) => void;
}

export function StoryViewer({ viewStory, setViewStory }: StoryViewerProps) {
  const [progressBar, setProgressBar] = useState(0);

  function renderStoryContent() {
    switch (viewStory?.media_type) {
      case "image":
        return (
          <img src={viewStory.media_url} alt="" className="max-w-full max-h-screen object-contain" />
        );
      case "video":
        return (
          <video src={viewStory.media_url} className="max-h-screen" autoPlay onEnded={() => setViewStory(null)}/>
        );
      case "text":
        return (
          <div className="w-full h-full flex items-center justify-center p-8 text-white text-2xl text-center">
            {viewStory.content}
          </div>
        );
    }
  }

  useEffect(() => { 
    let progressInterval: number;
    let timer: number;

    if (viewStory && viewStory.media_type !== "video") {
      setProgressBar(0);

      const duration = 10000;
      const setTime = 100;
      let elapsed = 0;

      progressInterval = setInterval(() => {
        elapsed += setTime;
        setProgressBar((elapsed / duration) * 100);
      }, setTime);

      timer = setTimeout(() => {
        setViewStory(null);
      }, duration);
    }

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    }

  }, [viewStory, setViewStory]);

  if (!viewStory) return null;

  return (
    <div 
      className="fixed inset-0 h-screen bg-black bg-opacity-90 z-110 flex items-center justify-center"
      style={{ backgroundColor: viewStory?.media_type === "text" ? viewStory.background_color : "#000000" }}
    >
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gray-700">
        <div 
          className="h-full bg-white transition-all duration-100 linear"
          style={{ width: `${progressBar}%` }}
        >
        </div>
      </div>

      {/* User info - Top Left */}
      <div className="absolute top-4 left-4 flex items-center justify-center space-x-3 p2 px-4 sm:p-4 sm:px-8 backdrop-blur-2xl rounded bg-black/50">
        <img 
          src={viewStory?.user.profile_picture} 
          alt="User Profile Image" 
          className="size-7 sm:size-8 rounded-full object-cover border border-white" 
        />

        <div className="text-white font-medium flex items-center gap-1.5">
          <span>{viewStory?.user.full_name}</span>
          <BadgeCheck size={18}/>
        </div>
      </div>

      {/* Close Button - Top Right */}
      <button 
        className="absolute top-4 right-4 text-white hover:text-gray-300"
        onClick={() => setViewStory(null)}
      >
        <X className="w-8 h-8 hover:scale-110 transition cursor-pointer" />
      </button>

      {/* Story Content */}
      <div className="max-w-[90vw] max-h-[90vh] flex items-center justify-center">
        {renderStoryContent()}
      </div>
    </div>
  );
}