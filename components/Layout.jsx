import React from 'react';
import Sidebar from "./Sidebar";

const Layout = ({children}) => {
    return (
        <div className="h-screen flex flex-row justify-start">
           <Sidebar/>
           <div className="flex-1">
             {children}
           </div>
        </div>
    );
};

export default Layout;