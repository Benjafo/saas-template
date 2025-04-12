import React, { useEffect, useState } from 'react';
import apiClient from '../../utils/api';

const EditTenantModal = ({ isOpen, onClose, tenantId, onTenantUpdated }) => {
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    active: true,
    subscription: {
      plan: 'free',
      status: 'active',
      seats: 1
    },
    billing: {
      billingEmail: ''
    },
    branding: {
      primaryColor: '#3B82F6',
      secondaryColor: '#1E40AF'
    }
  });

  // Fetch tenant data when modal opens and tenantId changes
  useEffect(() => {
    if (isOpen && tenantId) {
      fetchTenantData();
    }
  }, [isOpen, tenantId]);

  const fetchTenantData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/admin/tenants/${tenantId}`);
      const tenantData = response.data.data.tenant;
      
      setTenant(tenantData);
      setFormData({
        name: tenantData.name || '',
        active: tenantData.active !== false, // default to true if undefined
        subscription: {
          plan: tenantData.subscription?.plan || 'free',
          status: tenantData.subscription?.status || 'active',
          seats: tenantData.subscription?.seats || 1
        },
        billing: {
          billingEmail: tenantData.billing?.billingEmail || ''
        },
        branding: {
          primaryColor: tenantData.branding?.primaryColor || '#3B82F6',
          secondaryColor: tenantData.branding?.secondaryColor || '#1E40AF'
        }
      });
      
      setError(null);
    } catch (err) {
      console.error('Error fetching tenant data:', err);
      setError('Failed to load tenant data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setFormData({
        ...formData,
        [section]: {
          ...formData[section],
          [field]: type === 'checkbox' ? checked : value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      await apiClient.patch(`/admin/tenants/${tenantId}`, formData);
      
      // Call the callback to notify parent component
      if (onTenantUpdated) {
        onTenantUpdated();
      }
      
      // Close the modal
      onClose();
    } catch (err) {
      console.error('Error updating tenant:', err);
      setError('Failed to update tenant. Please try again.');
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
            Edit Tenant
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
            Update tenant information and settings
          </p>
        </div>
        
        {loading && !tenant ? (
          <div className="px-4 py-5 sm:p-6 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p className="mt-2 text-gray-500 dark:text-gray-400">Loading tenant data...</p>
          </div>
        ) : error ? (
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
        ) : (
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
                      <p className="text-gray-500 dark:text-gray-400">Tenant can access the platform</p>
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
                  
                  <div className="mb-4">
                    <label htmlFor="subscription.seats" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Seats
                    </label>
                    <input
                      type="number"
                      name="subscription.seats"
                      id="subscription.seats"
                      min="1"
                      value={formData.subscription.seats}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
                
                {/* Billing Information */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Billing</h4>
                  
                  <div className="mb-4">
                    <label htmlFor="billing.billingEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Billing Email
                    </label>
                    <input
                      type="email"
                      name="billing.billingEmail"
                      id="billing.billingEmail"
                      value={formData.billing.billingEmail}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
                
                {/* Branding */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Branding</h4>
                  
                  <div className="mb-4">
                    <label htmlFor="branding.primaryColor" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Primary Color
                    </label>
                    <div className="mt-1 flex items-center">
                      <input
                        type="color"
                        name="branding.primaryColor"
                        id="branding.primaryColor"
                        value={formData.branding.primaryColor}
                        onChange={handleChange}
                        className="h-8 w-8 rounded-md border-gray-300 dark:border-gray-600 mr-2"
                      />
                      <input
                        type="text"
                        name="branding.primaryColor"
                        value={formData.branding.primaryColor}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="branding.secondaryColor" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Secondary Color
                    </label>
                    <div className="mt-1 flex items-center">
                      <input
                        type="color"
                        name="branding.secondaryColor"
                        id="branding.secondaryColor"
                        value={formData.branding.secondaryColor}
                        onChange={handleChange}
                        className="h-8 w-8 rounded-md border-gray-300 dark:border-gray-600 mr-2"
                      />
                      <input
                        type="text"
                        name="branding.secondaryColor"
                        value={formData.branding.secondaryColor}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                      />
                    </div>
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
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditTenantModal;
