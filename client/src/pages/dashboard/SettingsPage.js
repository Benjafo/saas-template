import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const SettingsPage = () => {
  const { updatePassword, deleteAccount } = useAuth();
  const { darkMode, setTheme } = useTheme();
  
  const [passwordData, setPasswordData] = useState({
    passwordCurrent: '',
    password: '',
    passwordConfirm: '',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccess(false);
    setError('');

    if (passwordData.password !== passwordData.passwordConfirm) {
      setError('New passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const result = await updatePassword(passwordData);
      
      if (result.success) {
        setSuccess(true);
        setPasswordData({
          passwordCurrent: '',
          password: '',
          passwordConfirm: '',
        });
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Password update error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    setIsDeleting(true);
    setDeleteError('');

    if (deleteConfirm !== 'delete my account') {
      setDeleteError('Please type "delete my account" to confirm');
      setIsDeleting(false);
      return;
    }

    try {
      const result = await deleteAccount();
      
      if (!result.success) {
        setDeleteError(result.message);
      }
      // If successful, the user will be logged out and redirected
    } catch (err) {
      setDeleteError('An unexpected error occurred. Please try again.');
      console.error('Account deletion error:', err);
      setIsDeleting(false);
    }
  };

  return (
    <div className="py-10">
      <header>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white">Settings</h1>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="space-y-10 divide-y divide-gray-900/10 dark:divide-gray-700">
            {/* Theme Settings */}
            <div className="px-4 py-8 sm:px-0">
              <div className="rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Theme Settings</h3>
                  <div className="mt-6 space-y-6">
                    <div className="flex items-center gap-x-3">
                      <input
                        id="theme-light"
                        name="theme"
                        type="radio"
                        checked={!darkMode}
                        onChange={() => setTheme(false)}
                        className="h-4 w-4 border-gray-300 dark:border-gray-600 text-primary-600 dark:text-primary-500 focus:ring-primary-600 dark:focus:ring-primary-500"
                      />
                      <label htmlFor="theme-light" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
                        Light
                      </label>
                    </div>
                    <div className="flex items-center gap-x-3">
                      <input
                        id="theme-dark"
                        name="theme"
                        type="radio"
                        checked={darkMode}
                        onChange={() => setTheme(true)}
                        className="h-4 w-4 border-gray-300 dark:border-gray-600 text-primary-600 dark:text-primary-500 focus:ring-primary-600 dark:focus:ring-primary-500"
                      />
                      <label htmlFor="theme-dark" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
                        Dark
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Password Settings */}
            <div className="px-4 py-8 sm:px-0">
              <div className="rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Change Password</h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Update your password to keep your account secure.
                  </p>

                  {success && (
                    <div className="mt-4 rounded-md bg-success-50 dark:bg-success-900 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-success-400 dark:text-success-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-success-800 dark:text-success-200">
                            Password updated successfully
                          </h3>
                        </div>
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="mt-4 rounded-md bg-danger-50 dark:bg-danger-900 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-danger-400 dark:text-danger-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-danger-800 dark:text-danger-200">{error}</h3>
                        </div>
                      </div>
                    </div>
                  )}

                  <form className="mt-6 space-y-6" onSubmit={handlePasswordSubmit}>
                    <div>
                      <label htmlFor="passwordCurrent" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
                        Current password
                      </label>
                      <div className="mt-2">
                        <input
                          id="passwordCurrent"
                          name="passwordCurrent"
                          type="password"
                          autoComplete="current-password"
                          required
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-primary-600 dark:focus:ring-primary-500 sm:text-sm sm:leading-6 dark:bg-gray-700"
                          value={passwordData.passwordCurrent}
                          onChange={handlePasswordChange}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
                        New password
                      </label>
                      <div className="mt-2">
                        <input
                          id="password"
                          name="password"
                          type="password"
                          autoComplete="new-password"
                          required
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-primary-600 dark:focus:ring-primary-500 sm:text-sm sm:leading-6 dark:bg-gray-700"
                          value={passwordData.password}
                          onChange={handlePasswordChange}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="passwordConfirm" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
                        Confirm new password
                      </label>
                      <div className="mt-2">
                        <input
                          id="passwordConfirm"
                          name="passwordConfirm"
                          type="password"
                          autoComplete="new-password"
                          required
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-primary-600 dark:focus:ring-primary-500 sm:text-sm sm:leading-6 dark:bg-gray-700"
                          value={passwordData.passwordConfirm}
                          onChange={handlePasswordChange}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? 'Updating...' : 'Update password'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="px-4 py-8 sm:px-0">
              <div className="rounded-lg border border-danger-200 dark:border-danger-700 bg-danger-50 dark:bg-danger-900/20">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium leading-6 text-danger-800 dark:text-danger-200">Delete Account</h3>
                  <div className="mt-2 max-w-xl text-sm text-danger-700 dark:text-danger-300">
                    <p>
                      Once you delete your account, all of your data will be permanently removed. This action cannot be undone.
                    </p>
                  </div>

                  {deleteError && (
                    <div className="mt-4 rounded-md bg-danger-50 dark:bg-danger-900 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-danger-400 dark:text-danger-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-danger-800 dark:text-danger-200">{deleteError}</h3>
                        </div>
                      </div>
                    </div>
                  )}

                  <form className="mt-5" onSubmit={handleDeleteAccount}>
                    <div className="mb-4">
                      <label htmlFor="deleteConfirm" className="block text-sm font-medium text-danger-700 dark:text-danger-300">
                        To confirm, type "delete my account"
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="deleteConfirm"
                          id="deleteConfirm"
                          className="block w-full rounded-md border-danger-300 dark:border-danger-600 text-danger-900 dark:text-danger-100 placeholder:text-danger-400 dark:placeholder:text-danger-500 focus:border-danger-500 dark:focus:border-danger-400 focus:ring-danger-500 dark:focus:ring-danger-400 sm:text-sm dark:bg-gray-700"
                          value={deleteConfirm}
                          onChange={(e) => setDeleteConfirm(e.target.value)}
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={isDeleting}
                      className="rounded-md bg-danger-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-danger-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isDeleting ? 'Deleting...' : 'Delete account'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
