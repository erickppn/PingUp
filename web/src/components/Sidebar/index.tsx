import { Link } from "react-router-dom";
import { assets, dummyUserData } from "../../assets/assets";
import { MenuItems } from "./MenuItems";
import { CirclePlus, LogOut } from "lucide-react";
import { useClerk, UserButton } from "@clerk/clerk-react";

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

export function Sidebar({ isSidebarOpen, setIsSidebarOpen }: SidebarProps) {
  const user = dummyUserData;
  const { signOut } = useClerk();

  return (
    <aside className={ 
      `w-60 xl:w-72 bg-white border-r border-gray-200 flex flex-col justify-between items-center max-sm:absolute top-0 bottom-0 z-20 transition-all duration-300 ease-in-out
      ${isSidebarOpen ? "translate-x-0" : "max-sm:-translate-x-full"}`
    }>
      <div className="w-full">
        <Link to="/">
          <img src={assets.logo} alt="Pinup Logo" className="ml-7 my-2"/>
        </Link>
        <hr className="border-gray-300 mb-8"/>

        <MenuItems setIsSidebarOpen={setIsSidebarOpen} />

        <Link 
          to='/create-post' 
          className="flex items-center justify-center gap-2 py-2.5 mt-6 mx-6 rounded-lg bg-linear-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-700 hover:to-purple-800 active:scale-95 transition"
        >
          <CirclePlus className="w-5 h-5" />
          Create Post
        </Link>
      </div>

      <div className="w-full border-t border-gray-200 p-4 px-7 flex items-center justify-between">
        <div className="flex gap-2 items-center">
          <UserButton />

          <div>
            <h1 className="text-sm font-medium">{user.full_name}</h1>
            <h2 className="text-xs text-gray-500">@{user.username}</h2>
          </div>
        </div>

        <button 
          onClick={() => signOut()}
          className="w-4.5 text-gray-400 hover:text-gray-700 transition cursor-pointer"
        >
          <LogOut />
        </button>
      </div>
    </aside>
  );
}