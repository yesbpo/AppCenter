import React from 'react';
import Sidebar from "./Sidebar";
import { useSession,signIn, signOut } from 'next-auth/react';
const Layout = ({children}) => {
  const { data: session } = useSession()
  if (session) {
    return (
        <div className="h-screen flex">
           <Sidebar/>
           <div className="flex-1 overflow-y-auto">
             {children}
           </div>
        </div>
    )
  }
  return (
    <>
    <div className="flex flex-col items-center justify-center h-screen">
      <p className="mb-4">Not signed in</p>
      <button
        onClick={() => signIn()}
        className="bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded"
      >
        Sign in
      </button>
    </div>
  </>
  
    )

};

export default Layout;