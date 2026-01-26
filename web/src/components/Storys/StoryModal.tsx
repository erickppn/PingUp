import { ArrowLeft, Sparkle, TextIcon, Upload } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface StoryModalProps {
  setShowModal: (show: boolean) => void;
  fetchStories: () => Promise<void>;
}

export function StoryModal({ setShowModal, fetchStories }: StoryModalProps) {
  const bgColors = ["#4f46e5", "#7c3aed", "#db2777", "#e11d48", "#ca8a04"];

  const [mode, setMode] = useState<"text" | "media">("text");
  const [backgroundColor, setBackgroundColor] = useState(bgColors[0]);
  const [textContent, setTextContent] = useState("");
  const [media, setMedia] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  function handleMediaUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (file) {
      setMedia(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setMode("media");
    }
  }

  async function handleCreateStory() {
    toast.promise(
      new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, 2000);
      }).then(() => {
        setShowModal(false);
      }),
      {
        loading: "Saving...",
        success: "Story Added",
        error: "Failed to create story.",
      }
    );
  }

  return (
    <div className="fixed inset-0 z-110 min-h-screen bg-black/90 backdrop-blur text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-4 flex items-center justify-between">
          <button className="text-white p-2 cursor-pointer" onClick={() => setShowModal(false)}>
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>

          <h2 className="text-lg font-semibold">Create Story</h2>
          <span className="w-10"></span>
        </div>

        <div 
          className="rounded-lg h-96 items-center justify-center flex" 
          style={{ backgroundColor: backgroundColor }}
        >
          {
            mode === "text" && (
              <textarea
                className="bg-transparent text-white w-full h-full p-6 text-lg resize-none focus:outline-none" 
                placeholder="What's on your mind?" 
                onChange={(e) => setTextContent(e.target.value)}
                value={textContent}
              />
            )
          }

          {
            mode === "media" && previewUrl && (
              media?.type.startsWith("image") ? (
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="max-h-full object-contain" 
                />
              ) : (
                <video 
                  src={previewUrl} 
                  className="max-h-full object-contain" 
                />
              )
            )
          }
        </div>

        <div className="flex mt-4 gap-2">
          {bgColors.map((color) => (
            <button
              key={color}
              className="w-6 h-6 rounded-full ring cursor-pointer"
              style={{ backgroundColor: color}}
              onClick={() => setBackgroundColor(color)}
            >
            </button>
          ))}
        </div>

        <div className="flex gap-2 mt-4">
          <button 
            className={`flex-1 flex items-center justify-center gap-2 p-2 rounded cursor-pointer
              ${mode === "text" ? "bg-white text-black" : "bg-zinc-800"}
            `}
            onClick={() => {setMode("text"); setMedia(null); setPreviewUrl(null)}}
          >
            <TextIcon size={18}/> Text
          </button>

          <label
            className={`flex-1 flex items-center justify-center gap-2 p-2 rounded cursor-pointer
              ${mode === "media" ? "bg-white text-black" : "bg-zinc-800"}`}
          >
            <input 
              type="file" 
              accept="image/*,video/*"
              className="hidden"
              onChange={(e) => {handleMediaUpload(e)}}
            />

            <Upload size={18}/> Photo/Video
          </label>
        </div>

        <button 
          onClick={() => handleCreateStory()}
          className="flex items-center justify-center gap-2 text-white py-3 mt-4 w-full rounded bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:scale-95 transition cursor-pointer"
        >
          <Sparkle /> Create Story
        </button>
      </div>
    </div>
  );
}