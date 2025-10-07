import React from 'react';
import { NavLink } from 'react-router-dom';
import { assets } from "../assets/assets";
import { IoIosLogOut } from 'react-icons/io';
import { handleLogout } from '../utilities/authHandler';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {

  const navLinks = [
    {
      name: "Manage Products",
      path: "/adminhome",
    },
    {
      name: "Orders",
      path: "/history",
    },
    {
      name: "Reset Login",
      path: "/reset",
    },
  ]

  return (
    <div className="overflow-x-hidden styled-scrollbar min-h-screen bg-yellow-50/20 md:pt-[74px] pt-[130px]">
      <header className='bg-white fixed left-0 top-0 z-99 w-full flex flex-col gap-4 items-center justify-between shadow-md border-b border-black/20 py-4 md:px-8 px-4'>
        <div className='w-full flex items-center justify-between'>
            <div className="flex items-center gap-2">
                <img src={assets.logo} alt="Crownstore logo" className='w-10 mx-auto' />
                <h4 className='text-lg font-bold leading-4'>Crown Store</h4>
            </div>
            <ul className="md:inline-flex gap-4 hidden space-y-2">
              {
                navLinks.map((link, index) => (
                  <li key={index}>
                    <NavLink 
                      to={link.path} 
                      className={({ isActive }) => `font-medium ${isActive && "border-b-2"}`}
                    >
                      {link.name}
                    </NavLink>
                  </li>
                ))
              }
            </ul>
            <div className="flex items-center gap-4">
              <button
                type='button'
                onClick={handleLogout}
                className='bg-red-600 text-white flex items-center gap-2 p-2 rounded-md'
              >
                <IoIosLogOut />
                <span>Logout</span>
              </button>
            </div>
        </div>
        <ul className="md:hidden flex gap-4">
          {
            navLinks.map((link, index) => (
              <li key={index}>
                <NavLink 
                  to={link.path} 
                  className={({ isActive }) => `font-medium ${isActive && "border-b-2"}`}
                >
                  {link.name}
                </NavLink>
              </li>
            ))
          }
        </ul>
      </header>
      
      <div className="w-full md:p-8 p-4">
        {children}
      </div>
    </div>
  );
};

export default Layout;