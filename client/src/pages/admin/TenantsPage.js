import React, { useEffect, useState } from 'react';
import AddTenantModal from '../../components/admin/AddTenantModal';
import EditTenantModal from '../../components/admin/EditTenantModal';
import apiClient from '../../utils/api';

const TenantsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');
  const [selectedTenants, setSelectedTenants] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTenantId, setEditingTenantId] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const fetchTenants = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/admin/tenants');
        
        // Transform the API response to match the expected format
        const formattedTenants = response.data.data.tenants.map(tenant => {
          // Format the date to match the expected format
          const createdDate = tenant.createdAt ? new Date(tenant.createdAt) : new Date();
          const createdAt = createdDate.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          });
          
          return {
            id: tenant._id,
            name: tenant.name,
            plan: tenant.subscription?.plan?.charAt(0).toUpperCase() + tenant.subscription?.plan?.slice(1) || 'Free',
            status: tenant.active ? 'Active' : 'Inactive',
            users: tenant.users?.length || 0,
            createdAt,
            owner: tenant.owner?.name || 'N/A'
          };
        });
        
        setTenants(formattedTenants);
        setError(null);
      } catch (err) {
        console.error('Error fetching tenants:', err);
        setError('Failed to load tenants. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
  useEffect(() => {
    fetchTenants();
  }, []);

  const handleEditTenant = (tenantId) => {
    setEditingTenantId(tenantId);
    setIsEditModalOpen(true);
  };

  const handleTenantUpdated = () => {
    // Refresh the tenant list after a successful update
    fetchTenants();
  };
  
  const handleTenantAdded = () => {
    // Refresh the tenant list after a successful addition
    fetchTenants();
  };

  // Filter tenants based on search term, status, and plan
  const filteredTenants = tenants.filter((tenant) => {
    const matchesSearch = 
      tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.owner.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || tenant.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesPlan = planFilter === 'all' || tenant.plan.toLowerCase() === planFilter.toLowerCase();
    
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedTenants(filteredTenants.map(tenant => tenant.id));
    } else {
      setSelectedTenants([]);
    }
  };

  const handleSelectTenant = (tenantId) => {
    if (selectedTenants.includes(tenantId)) {
      setSelectedTenants(selectedTenants.filter(id => id !== tenantId));
    } else {
      setSelectedTenants([...selectedTenants, tenantId]);
    }
  };

  return (
    <div className="py-10">
      <header>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white">Tenants</h1>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="px-4 py-8 sm:px-0">
            <div className="rounded-lg border border-gray-200 dark:border-gray-700">
              {/* Filters */}
              <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-5 sm:px-6">
                <div className="flex flex-wrap items-center justify-between sm:flex-nowrap">
                  <div className="flex-1 min-w-0">
                    <div className="max-w-lg w-full lg:max-w-xs">
                      <label htmlFor="search" className="sr-only">Search</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <input
                          id="search"
                          name="search"
                          className="block w-full rounded-md border-0 bg-white dark:bg-gray-700 py-1.5 pl-10 pr-3 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-primary-600 dark:focus:ring-primary-500 sm:text-sm sm:leading-6"
                          placeholder="Search tenants"
                          type="search"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex mt-4 sm:mt-0 space-x-3">
                    <div>
                      <select
                        id="plan"
                        name="plan"
                        className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-600 focus:ring-2 focus:ring-primary-600 dark:focus:ring-primary-500 sm:text-sm sm:leading-6 dark:bg-gray-700"
                        value={planFilter}
                        onChange={(e) => setPlanFilter(e.target.value)}
                      >
                        <option value="all">All Plans</option>
                        <option value="free">Free</option>
                        <option value="pro">Pro</option>
                        <option value="enterprise">Enterprise</option>
                      </select>
                    </div>
                    <div>
                      <select
                        id="status"
                        name="status"
                        className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-600 focus:ring-2 focus:ring-primary-600 dark:focus:ring-primary-500 sm:text-sm sm:leading-6 dark:bg-gray-700"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                      >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                    <button
                      type="button"
                      className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                      onClick={() => setIsAddModalOpen(true)}
                    >
                      <svg className="-ml-0.5 mr-1.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                      </svg>
                      Add Tenant
                    </button>
                  </div>
                </div>
              </div>

              {/* Loading and Error States */}
              {loading && (
                <div className="text-center py-10">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                  <p className="mt-2 text-gray-500 dark:text-gray-400">Loading tenants...</p>
                </div>
              )}
              
              {error && (
                <div className="text-center py-10">
                  <div className="inline-block rounded-full h-8 w-8 bg-red-100 text-red-600 flex items-center justify-center">
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="mt-2 text-red-600">{error}</p>
                </div>
              )}
              
              {/* Tenants Table */}
              {!loading && !error && tenants.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-gray-500 dark:text-gray-400">No tenants found.</p>
                </div>
              )}
              
              {!loading && !error && tenants.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th scope="col" className="relative px-6 py-3">
                          <input
                            type="checkbox"
                            className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-primary-600 dark:text-primary-500 focus:ring-primary-600 dark:focus:ring-primary-500"
                            checked={selectedTenants.length === filteredTenants.length && filteredTenants.length > 0}
                            onChange={handleSelectAll}
                          />
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Plan
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Users
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Created
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Owner
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {filteredTenants.map((tenant) => (
                        <tr key={tenant.id} className={selectedTenants.includes(tenant.id) ? 'bg-primary-50 dark:bg-primary-900/20' : ''}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-primary-600 dark:text-primary-500 focus:ring-primary-600 dark:focus:ring-primary-500"
                              checked={selectedTenants.includes(tenant.id)}
                              onChange={() => handleSelectTenant(tenant.id)}
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0">
                                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary-500">
                                  <span className="text-sm font-medium leading-none text-white">
                                    {tenant.name.split(' ').map(n => n[0]).join('')}
                                  </span>
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">{tenant.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500 dark:text-gray-400">{tenant.plan}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              tenant.status === 'Active'
                                ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                                : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                            }`}>
                              {tenant.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500 dark:text-gray-400">{tenant.users}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500 dark:text-gray-400">{tenant.createdAt}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500 dark:text-gray-400">{tenant.owner}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              type="button"
                              className="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300"
                              onClick={() => handleEditTenant(tenant.id)}
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination */}
              <div className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    type="button"
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredTenants.length < 10 ? filteredTenants.length : 10}</span> of{' '}
                      <span className="font-medium">{filteredTenants.length}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        type="button"
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600"
                      >
                        <span className="sr-only">Previous</span>
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                      >
                        1
                      </button>
                      <button
                        type="button"
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600"
                      >
                        <span className="sr-only">Next</span>
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Edit Tenant Modal */}
      <EditTenantModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        tenantId={editingTenantId}
        onTenantUpdated={handleTenantUpdated}
      />
      
      {/* Add Tenant Modal */}
      <AddTenantModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onTenantAdded={handleTenantAdded}
      />
    </div>
  );
};

export default TenantsPage;
