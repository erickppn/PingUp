import { Outlet } from "react-router-dom";
import { Sidebar } from "../Sidebar";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Loading } from "../Loading";
import { dummyUserData } from "../../assets/assets";

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const user = dummyUserData;

  return user ? (
    <div className="w-full flex h-screen">
      <Sidebar isSidebarOpen={sidebarOpen} setIsSidebarOpen={setSidebarOpen} />

      <main className="flex-1 bg-slate-50">
        <Outlet />
      </main>

      {
        sidebarOpen ? (
          <button onClick={() => setSidebarOpen(false)}> 
            <X className="absolute top-3 right-3 p-2 z-100 bg-white rounded-md shadow w-10 h-10 text-gray-600 sm:hidden" />
          </button>
        ) : (
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="absolute top-3 right-3 p-2 z-100 bg-white rounded-md shadow w-10 h-10 text-gray-600 sm:hidden" />
          </button>
        )
      }
    </div>
  ) : (
    <Loading />
  )
}