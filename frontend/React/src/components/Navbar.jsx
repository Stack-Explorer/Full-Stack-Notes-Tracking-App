import React from 'react';
import { LogOut, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';

const Navbar = () => {
  const navigate = useNavigate();
  const { logout, authUser } = useAuthStore();

  return (
    <div className="navbar bg-base-100 shadow-lg">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
            <li><a onClick={() => navigate('/about')}>About</a></li>
          </ul>
        </div>
      </div>
      <div className="navbar-center">
        <p onClick={() => navigate("/")} className="btn btn-ghost text-xl">
          Notes Tracker
        </p>
      </div>
      <div className="navbar-end">
        <Settings
          className="w-4 hover:cursor-pointer mr-5 h-4"
          onClick={() => navigate("/settings")}
        />
        {authUser && (
          <button className="flex gap-2 items-center" onClick={logout}>
            <LogOut className="size-5 mr-5 hover:cursor-pointer ml-8" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;