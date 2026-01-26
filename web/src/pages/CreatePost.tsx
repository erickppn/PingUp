import { useState } from "react"
import { dummyUserData } from "../assets/assets";
import { Image, X } from "lucide-react";
import toast from "react-hot-toast";

export function CreatePost() {
  const [content, setContent] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const user = dummyUserData;

  function handleAddImages(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.length) return;

    setImages([...images, ...e.target.files]);
  }

  async function handleSubmitPost() {
    toast.promise(
      new Promise<void>((resolve) => {
        setLoading(true);
        setTimeout(() => {
          resolve();
        }, 2000);
      }).then(() => {
        setLoading(false);
        console.log({content, images});
        
      }),
      {
        loading: "Uploading...",
        success: "Post Added",
        error: "Failed to create post.",
      }
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-white">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Create Post
          </h1>

          <p className="text-slate-600">Share your thoughts with the world</p>
        </div>

        <div className="max-w-xl bg-white p-4 sm:p-8 sm:pb-3 rounded-xl shadow-md space-y-4">
          <div className="flex items-center gap-3">
            <img
              src={user.profile_picture}
              alt=''
              className="w-12 h-12 rounded-full shadow"
            />

            <div>
              <h2 className="font-semibold">
                {user.full_name}
              </h2>

              <h3 className="text-sm text-gray-500">
                @{user.username}
              </h3>
            </div>
          </div>

          <textarea
            onChange={e => setContent(e.target.value)}
            value={content}
            className="w-full resize-none max-h-20 mt-4 text-sm outline-none placeholder-gray-400"
            placeholder="What's happening?"
          />

          {
            images.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {
                  images.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(img)}
                        alt=""
                        className="h-20 rounded-md"
                      />

                      <button
                        onClick={() => setImages(images.filter((_, i) => i !== index))}
                        className="absolute hidden group-hover:flex justify-center items-center top-0 right-0 bottom-0 left-0 bg-black/40 rounded-md cursor-pointer"
                      >
                        <X className="w-6 h-6 text-white" />
                      </button>
                    </div>
                  ))
                }
              </div>
            )
          }

          <div className="flex items-center justify-between pt-3 border-t border-gray-300">
            <label htmlFor="images" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition cursor-pointer">
              <Image className="size-6" />
            </label>

            <input
              type="file"
              id="images"
              accept="image/*"
              hidden
              multiple
              onChange={handleAddImages}
            />

            <button
              onClick={handleSubmitPost}
              disabled={loading}
              className="text-sm bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:scale-95 transition text-white font-medium px-8 py-2 rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Publish Post
            </button>
          </div>
        </div>
      </div>
    </div>
  )
};