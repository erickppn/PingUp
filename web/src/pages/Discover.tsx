import { useState } from "react"
import { dummyConnectionsData } from "../assets/assets";
import type { User } from "../types/user";
import { Search } from "lucide-react";
import { UserCard } from "../components/UserCard";
import { Loading } from "../components/Loading";

export function Discover() {
  const [searchInput, setSearchInput] = useState("");
  const [users, setUsers] = useState<User[]>(dummyConnectionsData);
  const [loading, setLoading] = useState(false);

  async function handleSearch() {
    
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to white">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Discover People
          </h1>

          <p className="text-slate-600">
            Connect with amazing people and grow your network
          </p>
        </div>

        <div className="mb-8 shadow-md rounded-md border border-slate-200/60 bg-white/80 p-6">
          <div className="flex items-center border border-gray-300 rounded-md">
            <Search className="ml-3 text-slate-400 w-5 h-5"/>

            <input 
              type="text" 
              className="pl-3 sm:pl-3 py-2 w-full max-sm:text-sm" 
              placeholder="Search people by name, username, bio, location..."
              onChange={e => setSearchInput(e.target.value)}
              value={searchInput}
              onKeyUp={handleSearch}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-6">
          {users.map(user => (
            <UserCard key={user._id} user={user}/>
          ))}

          {loading && <Loading height="60vh"/>}
        </div>
      </div>
    </div>
  )
}