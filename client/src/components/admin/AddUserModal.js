import React, { useCallback, useEffect, useState } from 'react';
import apiClient from '../../utils/api';

const AddUserModal = ({ isOpen, onClose, onUserAdded }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [passwordError, setPasswordError] = useState('');
  const [tenants, setTenants] = useState([]);
  const [loadingTenants, setLoadingTenants] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    role: 'user',
    active: true,
    tenantId: '',
    subscription: {
      plan: 'free',
      status: 'active'
    }
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('subscription.')) {
      const subscriptionField = name.split('.')[1];
      setFormData({
        ...formData,
        subscription: {
          ...formData.subscription,
          [subscriptionField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  // Fetch tenants when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchTenants();
    }
  }, [isOpen]);

  const fetchTenants = async () => {
    try {
      setLoadingTenants(true);
      const response = await apiClient.get('/admin/tenants');
      setTenants(response.data.data.tenants);
    } catch (err) {
      console.error('Error fetching tenants:', err);
      setError('Failed to load tenants. Please try again.');
    } finally {
      setLoadingTenants(false);
    }
  };

  // Validate passwords match
  const validatePasswords = useCallback(() => {
    if (formData.password !== formData.passwordConfirm) {
      setPasswordError('Passwords do not match');
      return false;
    }
    
    if (formData.password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return false;
    }
    
    setPasswordError('');
    return true;
  }, [formData.password, formData.passwordConfirm]);

  // Validate passwords when either field changes
  useEffect(() => {
    if (formData.password || formData.passwordConfirm) {
      validatePasswords();
    }
  }, [formData.password, formData.passwordConfirm, validatePasswords]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords before submission
    if (!validatePasswords()) {
      return;
    }
    
    try {
      setLoading(true);
      await apiClient.post('/admin/users', formData);
      
      // Call the callback to notify parent component
      if (onUserAdded) {
        onUserAdded();
      }
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        passwordConfirm: '',
        role: 'user',
        active: true,
        tenantId: '',
        subscription: {
          plan: 'free',
          status: 'active'
        }
      });
      
      // Close the modal
      onClose();
    } catch (err) {
      console.error('Error adding user:', err);
      setError('Failed to add user. Please try again.');
      setLoading(false);
    }
  };

  // Add event listener for Escape key
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
            Add New User
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
            Create a new user account
          </p>
        </div>
        
        {error && (
          <div className="px-4 py-5 sm:p-6">
            <div className="rounded-md bg-red-50 dark:bg-red-900 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error</h3>
                  <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-6">
              {/* Basic Information */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Basic Information</h4>
                
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white ${
                      passwordError && formData.password ? 'border-red-300 dark:border-red-700' : ''
                    }`}
                    required
                    minLength={8}
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Password must be at least 8 characters</p>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="passwordConfirm"
                    id="passwordConfirm"
                    value={formData.passwordConfirm}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white ${
                      passwordError && formData.passwordConfirm ? 'border-red-300 dark:border-red-700' : ''
                    }`}
                    required
                  />
                  {passwordError && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">{passwordError}</p>
                  )}
                </div>
                
                <div className="mb-4">
                  <label htmlFor="tenantId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Tenant
                  </label>
                  <select
                    id="tenantId"
                    name="tenantId"
                    value={formData.tenantId}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                    disabled={loadingTenants}
                  >
                    <option value="">Select a tenant (optional)</option>
                    {tenants.map(tenant => (
                      <option key={tenant._id} value={tenant._id}>
                        {tenant.name}
                      </option>
                    ))}
                  </select>
                  {loadingTenants && (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Loading tenants...</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Leave blank for default tenant</p>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Role
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="super-admin">Super Admin</option>
                  </select>
                </div>
                
                <div className="mb-4 flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="active"
                      name="active"
                      type="checkbox"
                      checked={formData.active}
                      onChange={handleChange}
                      className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 dark:border-gray-600 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="active" className="font-medium text-gray-700 dark:text-gray-300">
                      Active
                    </label>
                    <p className="text-gray-500 dark:text-gray-400">User can log in and access the platform</p>
                  </div>
                </div>
              </div>
              
              {/* Subscription Information */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Subscription</h4>
                
                <div className="mb-4">
                  <label htmlFor="subscription.plan" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Plan
                  </label>
                  <select
                    id="subscription.plan"
                    name="subscription.plan"
                    value={formData.subscription.plan}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                  >
                    <option value="free">Free</option>
                    <option value="starter">Starter</option>
                    <option value="professional">Professional</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="subscription.status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Status
                  </label>
                  <select
                    id="subscription.status"
                    name="subscription.status"
                    value={formData.subscription.status}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                  >
                    <option value="active">Active</option>
                    <option value="trialing">Trialing</option>
                    <option value="past_due">Past Due</option>
                    <option value="canceled">Canceled</option>
                    <option value="unpaid">Unpaid</option>
                    <option value="incomplete">Incomplete</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 text-right sm:px-6 flex justify-end space-x-3 border-t border-gray-200 dark:border-gray-600">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;
