import React, { useMemo, useState, useEffect } from 'react';

import classNames from 'classnames';
import {
  BadgeCheckIcon,
  ChevronDoubleLeftIcon,
  UserGroupIcon,
  PresentationChartLineIcon,
  DocumentReportIcon,
  TemplateIcon,
  PaperAirplaneIcon,
  ChatIcon,
  LogoutIcon,
} from '@heroicons/react/outline';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { useSession, signOut } from 'next-auth/react';

const menuItems = [
  { id: 1, label: 'Usuarios', icon: UserGroupIcon, link: '/users' },
  { id: 2, label: 'Monitoreo', icon: PresentationChartLineIcon, link: '/monitoring' },
  { id: 3, label: 'Reportes', icon: DocumentReportIcon, link: '/reports' },
  { id: 4, label: 'Plantillas', icon: TemplateIcon, link: '/templates' },
  { id: 6, label: 'Envíos', icon: PaperAirplaneIcon, link: '/sends' },
  { id: 7, label: 'chats', icon: ChatIcon, link: '/chats' },
]
const menuItems1 = [
  { id: 7, label: 'chats', icon: ChatIcon, link: '/chats' },
]

const Sidebar = (props) => {
  const [toggleCollapse, setToggleCollapse] = useState(false);
  const [isCollapsible, setIsCollapsible] = useState(false);
  const { data: session } = useSession();
  const [userown, setUserown] = useState(session.user.name);
  
  const [ users, setUsers] =useState([])
  useEffect(() => {
    
    const fetchData = async () => {
      try {
        const generalUsers = await fetch('https://appcenteryes.appcenteryes.com/db/obtener-usuarios');
        const usersData = await generalUsers.json();
        const currentUser = usersData.filter((u) => u.usuario == session.user.name)
        setUsers(currentUser[0]);
        console.log(currentUser[0].type_user)
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchData();
  }, []);
  
  const selectedItems = users.type_user === 'Asesor' ? menuItems1 : menuItems;
  // Routing.
  const router = useRouter();
  const activeMenu = useMemo(() => selectedItems.find((menu) => menu.link === router.pathname), [
    router.pathname,
  ]);

  const wrapperClasses = classNames(
    'h-full pt-70 pb-4 bg-primary flex justify-between flex-col',
    {
      ['w-60']: !toggleCollapse,
      ['w-32']: toggleCollapse,
    }
  );

  const collapseIconClasses = classNames('p-4 rounded bg-light-contrast absolute right-4', {
    'rotate-180': toggleCollapse,
  });

  const onMouseOver = () => {
    setIsCollapsible(!isCollapsible);
  };

  const handleSidebarToggle = () => {
    setToggleCollapse(!toggleCollapse);
  };

  const getNavItemClasses = (menu) => {
    return classNames(
      'flex items-center cursor-pointer hover:bg-light-contrast rounded w-full overflow-hidden whitespace-nowrap',
      {
        ['bg-light-contrast']: activeMenu && activeMenu.id === menu.id,
      }
    );
  };

  const updateuser = async () => {
    const usuario = userown // Reemplaza con el nombre de usuario que deseas actualizar
    const nuevoDato = 'Inactivo'; // Reemplaza con el nuevo valor que deseas asignar

    try {
      const response = await fetch('https://appcenteryes.appcenteryes.com/db/actualizar/usuario', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nuevoDato: nuevoDato,
          usuario: usuario,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data); // Aquí puedes manejar la respuesta del servidor
        
          signOut();
         
      } else {
        console.error('Error al actualizar el usuario:', response.statusText);
      }
      
    } catch (error) {
      console.error('Error de red:', error.message);
    }
    
  };

  

  if (session) {
    // TODO: - Change the icon for an actual logo
    return (
      <div
        className={wrapperClasses}
        onMouseEnter={onMouseOver}
        onMouseLeave={onMouseOver}
        style={{
          transition: 'width 300ms cubic-bezier(0.2, 0, 0, 1) 0s',
        }}
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between relative">
            <div className="flex items-center ml-8">
              <BadgeCheckIcon className="h-24 w-24 text-light-lighter" />
              <h1>{session.user.name}</h1>

            </div>
            {isCollapsible && (
              <button className={collapseIconClasses} onClick={handleSidebarToggle}>
                <ChevronDoubleLeftIcon className="h-8 w-8 text-light-lighter" />
                              </button>
            )}
          </div>
          <div className="h-full flex flex-col items-start mt-2 m-8">
            {selectedItems.map(({ icon: Icon, ...menu }) => {
              const classes = getNavItemClasses(menu);
              return (
                // eslint-disable-next-line react/jsx-key
                <div className={classes}>
                  <Link href={menu.link}>
                    <a className="flex py-4 px-3 items-center w-full h-full">
                      <div>
                        <Icon className="h-10 w-10 text-light-lighter mr-4" />
                      </div>
                      {!toggleCollapse && (
                        <span className={classNames('text-lg font-medium text-text-frozen')}>
                          {menu.label}
                        </span>
                      )}
                    </a>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
        <div className={`${getNavItemClasses({})} px-3 py-4 flex justify-items-center`}>
          <button onClick={updateuser}>
            <a className="flex py-4 px-3 items-center w-full h-full">
              <div>
                <LogoutIcon className="h-10 w-10 text-light-lighter mr-4" />
              </div>
              {!toggleCollapse && (
                <span className={classNames('text-lg font-medium text-text-frozen')}>Cerrar Sesion</span>
              )}
            </a>
          </button>
        </div>
      </div>
    );
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
  );
};

export default Sidebar;
