import React, { useEffect, useState } from 'react';
import AddUserModal from '../../components/admin/AddUserModal';
import EditUserModal from '../../components/admin/EditUserModal';
import ViewUserModal from '../../components/admin/ViewUserModal';
import apiClient from '../../utils/api';

const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingUserId, setViewingUserId] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/admin/users');
        console.log('Users list: ', response);
        
        // Log the first user to inspect the structure
        if (response.data.data.users.length > 0) {
          console.log('First user data structure:', response.data.data.users[0]);
        }
        
        // Transform the API response to match the expected format
        const formattedUsers = response.data.data.users.map(user => {
          // Format the date to match the expected format
          const lastLoginDate = user.updatedAt ? new Date(user.updatedAt) : new Date();
          const lastLogin = lastLoginDate.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          });
          
          // Determine user status from subscription status
          let isActive = false;
          if (user.subscription && user.subscription.status) {
            isActive = ['active', 'trialing'].includes(user.subscription.status.toLowerCase());
          }
          
          // Use tenant ID as tenant name for now
          let tenantName = user.tenantId ? user.tenantId : 'N/A';
          
          return {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role.charAt(0).toUpperCase() + user.role.slice(1), // Capitalize role
            status: isActive ? 'Active' : 'Inactive',
            tenantName: tenantName,
            lastLogin
          };
        });
        
        setUsers(formattedUsers);
        setError(null);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditUser = (userId) => {
    setEditingUserId(userId);
    setIsEditModalOpen(true);
  };

  const handleViewUser = (userId) => {
    setViewingUserId(userId);
    setIsViewModalOpen(true);
  };

  const handleUserUpdated = () => {
    // Refresh the user list after a successful update
    fetchUsers();
  };
  
  const handleUserAdded = () => {
    // Refresh the user list after a successful addition
    fetchUsers();
  };

  // Filter users based on search term, role, and status
  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.tenantName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role.toLowerCase() === roleFilter.toLowerCase();
    const matchesStatus = statusFilter === 'all' || user.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Get current users for pagination
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  
  // Calculate total pages
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  // Go to next page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  // Go to previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedUsers(filteredUsers.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  return (
    <div className="py-10">
      <header>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white">Users</h1>
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
                          placeholder="Search users"
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
                        id="role"
                        name="role"
                        className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-600 focus:ring-2 focus:ring-primary-600 dark:focus:ring-primary-500 sm:text-sm sm:leading-6 dark:bg-gray-700"
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                      >
                        <option value="all">All Roles</option>
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
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
                      Add User
                    </button>
                  </div>
                </div>
              </div>

              {/* Loading and Error States */}
              {loading && (
                <div className="text-center py-10">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                  <p className="mt-2 text-gray-500 dark:text-gray-400">Loading users...</p>
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
              
              {/* Users Table */}
              {!loading && !error && users.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-gray-500 dark:text-gray-400">No users found.</p>
                </div>
              )}
              
              {!loading && !error && users.length > 0 && (
                <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th scope="col" className="relative px-6 py-3">
                        <input
                          type="checkbox"
                          className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-primary-600 dark:text-primary-500 focus:ring-primary-600 dark:focus:ring-primary-500"
                          checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                          onChange={handleSelectAll}
                        />
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Role
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Tenant
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Last Login
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {currentUsers.map((user) => (
                      <tr key={user.id} className={selectedUsers.includes(user.id) ? 'bg-primary-50 dark:bg-primary-900/20' : ''}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-primary-600 dark:text-primary-500 focus:ring-primary-600 dark:focus:ring-primary-500"
                            checked={selectedUsers.includes(user.id)}
                            onChange={() => handleSelectUser(user.id)}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-500">
                                <span className="text-sm font-medium leading-none text-white">
                                  {(() => {
                                    const nameParts = user.name.split(' ').filter(part => part.length > 0);
                                    if (nameParts.length === 0) return '';
                                    if (nameParts.length === 1) return nameParts[0][0];
                                    return nameParts[0][0] + nameParts[nameParts.length - 1][0];
                                  })()}
                                </span>
                              </span>
                            </div>
                            <div className="ml-4">
                              <div 
                                className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer hover:text-primary-600 dark:hover:text-primary-400"
                                onClick={() => handleViewUser(user.id)}
                              >
                                {user.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 dark:text-gray-400">{user.role}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            user.status === 'Active'
                              ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                              : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 dark:text-gray-400">{user.tenantName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 dark:text-gray-400">{user.lastLogin}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            type="button"
                            className="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300"
                            onClick={() => handleEditUser(user.id)}
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
                    onClick={prevPage}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Showing <span className="font-medium">{indexOfFirstUser + 1}</span> to{' '}
                      <span className="font-medium">
                        {Math.min(indexOfLastUser, filteredUsers.length)}
                      </span> of{' '}
                      <span className="font-medium">{filteredUsers.length}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        type="button"
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600"
                        onClick={prevPage}
                        disabled={currentPage === 1}
                      >
                        <span className="sr-only">Previous</span>
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                        </svg>
                      </button>
                      {[...Array(totalPages).keys()].map((number) => (
                        <button
                          key={number + 1}
                          type="button"
                          onClick={() => paginate(number + 1)}
                          className={`relative inline-flex items-center px-4 py-2 border ${
                            currentPage === number + 1
                              ? 'bg-primary-50 dark:bg-primary-900 border-primary-500 dark:border-primary-500 text-primary-600 dark:text-primary-400'
                              : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200'
                          } text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-600`}
                        >
                          {number + 1}
                        </button>
                      ))}
                      <button
                        type="button"
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600"
                        onClick={nextPage}
                        disabled={currentPage === totalPages}
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
      {/* Edit User Modal */}
      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        userId={editingUserId}
        onUserUpdated={handleUserUpdated}
      />

      {/* View User Modal */}
      <ViewUserModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        userId={viewingUserId}
      />
      
      {/* Add User Modal */}
      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onUserAdded={handleUserAdded}
      />
    </div>
  );
};

export default UsersPage;
