/**
 * Header Component
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import {
  Bars3Icon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

export const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="bg-pure-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center p-2 rounded-button text-slate-gray hover:text-deep-navy hover:bg-soft-gray focus:outline-none focus:ring-2 focus:ring-inset focus:ring-royal-blue"
          >
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Page title */}
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-deep-navy sm:truncate sm:tracking-tight">
              {/* This will be set by each page */}
            </h2>
          </div>

          {/* User menu */}
          <div className="ml-4 flex items-center relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center max-w-xs text-sm rounded-button focus:outline-none focus:ring-2 focus:ring-royal-blue p-2"
            >
              <UserCircleIcon className="h-8 w-8 text-slate-gray" />
              <div className="ml-3 text-left hidden sm:block">
                <p className="text-sm font-medium text-deep-navy">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-xs text-slate-gray">{user?.email}</p>
              </div>
            </button>

            {/* Dropdown menu */}
            {showDropdown && (
              <div className="origin-top-right absolute right-0 top-12 mt-2 w-48 rounded-card shadow-card-hover bg-pure-white ring-1 ring-black ring-opacity-5 animate-scale-in">
                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      navigate('/settings');
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-deep-navy hover:bg-soft-gray flex items-center"
                  >
                    <UserCircleIcon className="mr-3 h-5 w-5 text-slate-gray" />
                    Profile Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-error-red hover:bg-soft-gray flex items-center"
                  >
                    <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </header>
  );
};
