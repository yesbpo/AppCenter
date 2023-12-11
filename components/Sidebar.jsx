import React, {useMemo, useState} from 'react';
import classNames from "classnames";
import {
  BadgeCheckIcon,
  ChevronDoubleLeftIcon,
  UserGroupIcon,
  PresentationChartLineIcon,
  DocumentReportIcon, TemplateIcon, DatabaseIcon, PaperAirplaneIcon, LogoutIcon
} from "@heroicons/react/outline";
import {useRouter} from "next/router";
import Link from "next/link";
import {useDispatch} from "react-redux";
import {setAuthState} from "../store/authSlice";
import {setCurrentUser} from "../store/userSlice";
import { useSession, signIn, signOut } from "next-auth/react"

const menuItems = [
  {id: 1, label: "Usuarios", icon: UserGroupIcon, link: "/Component"},
  {id: 2, label: "Monitoreo", icon: PresentationChartLineIcon, link: "/monitoring"},
  {id: 3, label: "Reportes", icon: DocumentReportIcon, link: "/reports"},
  {id: 4, label: "Plantillas", icon: TemplateIcon, link: "/templates"},
  {id: 5, label: "em", icon: DatabaseIcon, link: "/em"},
  {id: 6, label: "Envíos", icon: PaperAirplaneIcon, link: "/sends"},
  {id: 7, label: "chats", icon: PaperAirplaneIcon, link: "/chats"},
  {id: 8, label: "pruebas", icon: PaperAirplaneIcon, link: "/pruebas"}
]

const Sidebar = (props) => {

  const [toggleCollapse, setToggleCollapse] = useState(false);
  const [isCollapsible, setIsCollapsible,] = useState(false);

  // Redux state.
  const dispatch = useDispatch();

  // Routing.
  const router = useRouter()
  const activeMenu = useMemo(() => menuItems.find(menu => menu.link === router.pathname), [router.pathname]);


  const wrapperClasses = classNames(
      "h-screen pt-70 pb-4 bg-primary flex justify-between flex-col",
      {
        ['w-60']: !toggleCollapse,
        ['w-32']: toggleCollapse
      }
  );

  const collapseIconClasses = classNames("p-4 rounded bg-light-contrast absolute right-4", {
    "rotate-180": toggleCollapse
  })

  const onMouseOver = () => {
    setIsCollapsible(!isCollapsible)
  }

  const handleSidebarToggle = () => {
    setToggleCollapse(!toggleCollapse)
  }

  const getNavItemClasses = (menu) => {
    return classNames("flex items-center cursor-pointer hover:bg-light-contrast rounded w-full overflow-hidden whitespace-nowrap", {
      ["bg-light-contrast"]: activeMenu && activeMenu.id === menu.id
    })
  }

  
  const { data: session } = useSession()
  
  // TODO: - Change the icon for an actual logo
  return (
      <div
          className={wrapperClasses}
          onMouseEnter={onMouseOver}
          onMouseLeave={onMouseOver}
          style={{
            transition: "width 300ms cubic-bezier(0.2, 0, 0, 1) 0s"
          }}
      >
        
        <div className="flex flex-col">
          <div className="flex items-center justify-between relative">
            <div className="flex items-center ml-8">
              <BadgeCheckIcon className="h-24 w-24 text-light-lighter"/>
            </div>
            {
                isCollapsible &&
                <button className={collapseIconClasses} onClick={handleSidebarToggle}>
                  <ChevronDoubleLeftIcon className="h-8 w-8 text-light-lighter"/>
                </button>
            }
          </div>
          <div className="flex flex-col items-start mt-24 m-8">
            {
              menuItems.map(({icon: Icon, ...menu}) =>{
                const classes = getNavItemClasses(menu);
                return (
                    // eslint-disable-next-line react/jsx-key
                    <div className={classes}>
                      <Link href={menu.link}>
                       <a className="flex py-4 px-3 items-center w-full h-full">
                         <div>
                           <Icon className="h-10 w-10 text-light-lighter mr-4"/>
                         </div>
                         {!toggleCollapse && <span className={classNames("text-lg font-medium text-text-frozen")}>{menu.label}</span>}
                       </a>
                      </Link>
                    </div>
                );
              })
            }
          </div>
        </div>
        <div className={`${getNavItemClasses({})} px-3 py-4 flex justify-items-center`}>
          <button onClick={() => signOut()}>
            <Link href="/api/auth/signin">
              <a className="flex py-4 px-3 items-center w-full h-full">
                <div>
                  <LogoutIcon className="h-10 w-10 text-light-lighter mr-4"/>
                </div>
                {!toggleCollapse && <span className={classNames("text-lg font-medium text-text-frozen")}>Cerrar Sesion</span>}
              </a>
            </Link>
          </button>
        </div>
      </div>
  );
};

export default Sidebar;