import React from 'react';
import Sidebar from "./Sidebar";
import { useSession,signIn, signOut } from 'next-auth/react';
const Layout = ({children}) => {
  const { data: session } = useSession()
  if (session) {
    return (
        <div className="h-screen flex flex-row justify-start">
           <Sidebar/>
           <div className="flex-1">
             {children}
           </div>
        </div>
    )
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
    )

};

export default Layout;