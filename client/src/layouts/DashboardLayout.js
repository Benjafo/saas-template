import { Dialog, Transition } from '@headlessui/react';
import {
    ArrowRightOnRectangleIcon,
    Bars3Icon,
    ChartBarIcon,
    Cog6ToothIcon,
    CreditCardIcon,
    HomeIcon,
    MoonIcon,
    SunIcon,
    UserIcon
} from '@heroicons/react/24/outline';
import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Profile', href: '/dashboard/profile', icon: UserIcon },
    { name: 'Subscription', href: '/dashboard/subscription', icon: ChartBarIcon },
    { name: 'Billing', href: '/dashboard/billing', icon: CreditCardIcon },
    { name: 'Settings', href: '/dashboard/settings', icon: Cog6ToothIcon },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar */}
      <Transition.Root show={sidebarOpen} as={React.Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={React.Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={React.Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white dark:bg-gray-800 px-6 pb-4">
                  <div className="flex h-16 shrink-0 items-center">
                    <Link to="/" className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                      SaaS Template
                    </Link>
                  </div>
                  <nav className="flex flex-1 flex-col">
                    <ul className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul className="-mx-2 space-y-1">
                          {navigation.map((item) => (
                            <li key={item.name}>
                              <Link
                                to={item.href}
                                className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold ${
                                  location.pathname === item.href
                                    ? 'bg-gray-100 dark:bg-gray-700 text-primary-600 dark:text-primary-400'
                                    : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                              >
                                <item.icon
                                  className={`h-6 w-6 shrink-0 ${
                                    location.pathname === item.href
                                      ? 'text-primary-600 dark:text-primary-400'
                                      : 'text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400'
                                  }`}
                                  aria-hidden="true"
                                />
                                {item.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                      
                      {/* Admin Link - Only visible to admin users (Mobile) */}
                      {(user?.role === 'admin' || user?.role === 'super-admin') && (
                        <li className="pt-2">
                          <div className="text-xs font-semibold leading-6 text-gray-500 dark:text-gray-400 mb-2">
                            Administration
                          </div>
                          <ul className="-mx-2 space-y-1">
                            <li>
                              <Link
                                to="/admin"
                                className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold ${
                                  location.pathname.startsWith('/admin')
                                    ? 'bg-gray-100 dark:bg-gray-700 text-primary-600 dark:text-primary-400'
                                    : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                              >
                                <svg
                                  className={`h-6 w-6 shrink-0 ${
                                    location.pathname.startsWith('/admin')
                                      ? 'text-primary-600 dark:text-primary-400'
                                      : 'text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400'
                                  }`}
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                                  />
                                </svg>
                                Admin Dashboard
                              </Link>
                            </li>
                          </ul>
                        </li>
                      )}
                      
                      <li className="mt-auto">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Theme</span>
                          <button
                            onClick={toggleDarkMode}
                            className="rounded-full p-1 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            {darkMode ? (
                              <SunIcon className="h-6 w-6" aria-hidden="true" />
                            ) : (
                              <MoonIcon className="h-6 w-6" aria-hidden="true" />
                            )}
                          </button>
                        </div>
                        <button
                          onClick={handleLogout}
                          className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-primary-400 w-full"
                        >
                          <ArrowRightOnRectangleIcon
                            className="h-6 w-6 shrink-0 text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400"
                            aria-hidden="true"
                          />
                          Logout
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <Link to="/" className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              SaaS Template
            </Link>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold ${
                          location.pathname === item.href
                            ? 'bg-gray-100 dark:bg-gray-700 text-primary-600 dark:text-primary-400'
                            : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <item.icon
                          className={`h-6 w-6 shrink-0 ${
                            location.pathname === item.href
                              ? 'text-primary-600 dark:text-primary-400'
                              : 'text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400'
                          }`}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              
              {/* Admin Link - Only visible to admin users */}
              {(user?.role === 'admin' || user?.role === 'super-admin') && (
                <li className="pt-2">
                  <div className="text-xs font-semibold leading-6 text-gray-500 dark:text-gray-400 mb-2">
                    Administration
                  </div>
                  <ul className="-mx-2 space-y-1">
                    <li>
                      <Link
                        to="/admin"
                        className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold ${
                          location.pathname.startsWith('/admin')
                            ? 'bg-gray-100 dark:bg-gray-700 text-primary-600 dark:text-primary-400'
                            : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <svg
                          className={`h-6 w-6 shrink-0 ${
                            location.pathname.startsWith('/admin')
                              ? 'text-primary-600 dark:text-primary-400'
                              : 'text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400'
                          }`}
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                          />
                        </svg>
                        Admin Dashboard
                      </Link>
                    </li>
                  </ul>
                </li>
              )}
              <li className="mt-auto">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Theme</span>
                  <button
                    onClick={toggleDarkMode}
                    className="rounded-full p-1 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {darkMode ? (
                      <SunIcon className="h-6 w-6" aria-hidden="true" />
                    ) : (
                      <MoonIcon className="h-6 w-6" aria-hidden="true" />
                    )}
                  </button>
                </div>
                <button
                  onClick={handleLogout}
                  className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-primary-400 w-full"
                >
                  <ArrowRightOnRectangleIcon
                    className="h-6 w-6 shrink-0 text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400"
                    aria-hidden="true"
                  />
                  Logout
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div className="lg:pl-72">
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 dark:text-gray-300 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Separator */}
          <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 lg:hidden" aria-hidden="true" />

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex-1" />
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200 lg:dark:bg-gray-700" aria-hidden="true" />

              {/* Profile dropdown */}
              <div className="relative">
                <div className="flex items-center gap-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <UserIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" aria-hidden="true" />
                    </div>
                  </div>
                  <div className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100">
                    {user?.name || 'User'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
