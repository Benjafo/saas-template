import React, { useEffect, useState } from 'react';
import apiClient from '../../utils/api';

const AddSubscriptionModal = ({ isOpen, onClose, onSubscriptionAdded }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [formData, setFormData] = useState({
    userId: '',
    plan: 'free',
    status: 'active',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    seats: 1
  });

  // Fetch users when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);
  
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

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const response = await apiClient.get('/admin/users');
      setUsers(response.data.data.users);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.userId) {
      setError('Please select a user');
      return;
    }
    
    try {
      setLoading(true);
      await apiClient.post(`/admin/subscriptions`, formData);
      
      // Call the callback to notify parent component
      if (onSubscriptionAdded) {
        onSubscriptionAdded();
      }
      
      // Reset form
      setFormData({
        userId: '',
        plan: 'free',
        status: 'active',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        seats: 1
      });
      
      // Close the modal
      onClose();
    } catch (err) {
      console.error('Error adding subscription:', err);
      setError('Failed to add subscription. Please try again.');
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
            Add New Subscription
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
            Create a new subscription for a user
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
              {/* User Selection */}
              <div>
                <label htmlFor="userId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  User
                </label>
                <select
                  id="userId"
                  name="userId"
                  value={formData.userId}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                  required
                  disabled={loadingUsers}
                >
                  <option value="">Select a user</option>
                  {users.map(user => (
                    <option key={user._id} value={user._id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
                {loadingUsers && (
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Loading users...</p>
                )}
              </div>
              
              {/* Subscription Information */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Subscription Details</h4>
                
                <div className="mb-4">
                  <label htmlFor="plan" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Plan
                  </label>
                  <select
                    id="plan"
                    name="plan"
                    value={formData.plan}
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
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
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
                
                <div className="mb-4">
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    id="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    id="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Leave blank for ongoing subscription</p>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="seats" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Seats
                  </label>
                  <input
                    type="number"
                    name="seats"
                    id="seats"
                    min="1"
                    value={formData.seats}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                  />
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
              {loading ? 'Creating...' : 'Create Subscription'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSubscriptionModal;
