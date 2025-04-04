import {
  ArrowDownIcon,
  ArrowUpIcon,
  CreditCardIcon,
  DocumentTextIcon,
  ServerIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import axios from 'axios';
import { format, formatDistanceToNow } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const DashboardPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState([]);
  const [activities, setActivities] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch user subscription
        const subscriptionRes = await axios.get('/api/v1/users/subscription');
        setSubscription(subscriptionRes.data.data.subscription);
        
        let activities = [];
        let invoices = [];
        
        try {
          // Fetch recent activities
          const activitiesRes = await axios.get('/api/v1/seed/activities');
          
          // Only take the 5 most recent activities
          activities = activitiesRes.data.data.activities.slice(0, 5);
        } catch (activityError) {
          console.warn('Could not fetch activities:', activityError);
          // Continue with empty activities
        }
        
        try {
          // Fetch invoices
          const invoicesRes = await axios.get('/api/v1/seed/invoices');
          invoices = invoicesRes.data.data.invoices;
        } catch (invoiceError) {
          console.warn('Could not fetch invoices:', invoiceError);
          // Continue with empty invoices
        }
        
        setActivities(activities);
        setInvoices(invoices);
        
        // Generate stats based on the data
        const userSubscription = subscriptionRes.data.data.subscription;
        const tenantFeatures = userSubscription?.features || {};
        
        const statsData = [
          { 
            id: 1, 
            name: 'Storage Used', 
            value: tenantFeatures.storage ? `${(tenantFeatures.storage / 1000).toFixed(1)} GB` : '100 MB', 
            icon: ServerIcon, 
            change: '+4.75%', 
            changeType: 'increase' 
          },
          { 
            id: 2, 
            name: 'Active Users', 
            value: '12', // This would come from a real API in a production app
            icon: UserGroupIcon, 
            change: '+10.18%', 
            changeType: 'increase' 
          },
          { 
            id: 3, 
            name: 'Documents', 
            value: `${Math.floor(Math.random() * 100) + 50}`, // Random number for demo
            icon: DocumentTextIcon, 
            change: '+3.45%', 
            changeType: 'increase' 
          },
          { 
            id: 4, 
            name: 'Next Invoice', 
            value: userSubscription?.plan === 'free' ? 'Free' : 
                  `$${invoices.length > 0 ? 
                     invoices[0].amount.toFixed(2) : '0.00'}`, 
            icon: CreditCardIcon, 
            change: userSubscription?.endDate ? format(new Date(userSubscription.endDate), 'MMM d, yyyy') : 'N/A', 
            changeType: 'neutral' 
          },
        ];
        
        setStats(statsData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  // Format activity date to relative time (e.g., "2 hours ago")
  const formatActivityDate = (dateString) => {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900 p-4 rounded-md">
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
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Welcome back, {user?.name || 'User'}! Here's what's happening with your account today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className="h-6 w-6 text-gray-400 dark:text-gray-500" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{stat.name}</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900 dark:text-white">{stat.value}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 px-5 py-3">
              <div className="text-sm">
                <div className="flex items-center">
                  {stat.changeType === 'increase' ? (
                    <ArrowUpIcon
                      className="h-4 w-4 flex-shrink-0 self-center text-success-500 dark:text-success-400"
                      aria-hidden="true"
                    />
                  ) : stat.changeType === 'decrease' ? (
                    <ArrowDownIcon
                      className="h-4 w-4 flex-shrink-0 self-center text-danger-500 dark:text-danger-400"
                      aria-hidden="true"
                    />
                  ) : null}
                  <span
                    className={`ml-1 ${
                      stat.changeType === 'increase'
                        ? 'text-success-600 dark:text-success-400'
                        : stat.changeType === 'decrease'
                        ? 'text-danger-600 dark:text-danger-400'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Subscription Status */}
      <div className="mt-8 overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow">
        <div className="px-4 py-5 sm:p-6">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Subscription Status</h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500 dark:text-gray-400">
                <p>
                  You are currently on the{' '}
                  <span className="font-medium capitalize">{subscription?.plan || 'Free'}</span> plan.
                  {subscription?.endDate && (
                    <> Your subscription {subscription.status === 'active' ? 'renews' : 'ends'} on {format(new Date(subscription.endDate), 'MMMM d, yyyy')}.</>
                  )}
                </p>
                {subscription?.status === 'trialing' && subscription?.trialEndsAt && (
                  <p className="mt-1">
                    Your trial ends on {format(new Date(subscription.trialEndsAt), 'MMMM d, yyyy')}.
                  </p>
                )}
                {subscription?.status === 'past_due' && (
                  <p className="mt-1 text-danger-600 dark:text-danger-400">
                    Your payment is past due. Please update your billing information.
                  </p>
                )}
              </div>
            </div>
            <div className="mt-5 sm:mt-0 sm:ml-6 sm:flex sm:flex-shrink-0 sm:items-center">
              <Link
                to="/dashboard/subscription"
                className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
              >
                Manage Subscription
              </Link>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 px-4 py-4 sm:px-6">
          <div className="text-sm">
            <Link to="/dashboard/billing" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
              View billing history{invoices.length > 0 ? ` (${invoices.length} invoices)` : ''}<span aria-hidden="true"> &rarr;</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8 overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Recent Activity</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">Latest actions in your workspace.</p>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700">
          {activities.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
              No recent activity found.
            </div>
          ) : (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {activities.map((activity, index) => (
                <li key={index} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      <span className="font-semibold">
                        {activity.user === user?.name ? 'You' : activity.user}
                      </span>{' '}
                      {activity.action}{' '}
                      {activity.target && (
                        <span className="font-semibold text-primary-600 dark:text-primary-400">
                          {activity.target}
                        </span>
                      )}
                    </p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatActivityDate(activity.date)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 px-4 py-4 sm:px-6">
          <div className="text-sm">
            <a href="#" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
              View all activity<span aria-hidden="true"> &rarr;</span>
            </a>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Quick Actions</h3>
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-md bg-gray-50 dark:bg-gray-700 px-6 py-5 text-center">
              <DocumentTextIcon className="mx-auto h-8 w-8 text-gray-400 dark:text-gray-500" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Create Document</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Start a new document from scratch.</p>
              <div className="mt-4">
                <a
                  href="#"
                  className="inline-flex items-center rounded-md bg-white dark:bg-gray-800 px-3 py-2 text-sm font-medium leading-4 text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Create
                </a>
              </div>
            </div>

            <div className="rounded-md bg-gray-50 dark:bg-gray-700 px-6 py-5 text-center">
              <UserGroupIcon className="mx-auto h-8 w-8 text-gray-400 dark:text-gray-500" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Invite Team Member</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Add someone to your workspace.</p>
              <div className="mt-4">
                <a
                  href="#"
                  className="inline-flex items-center rounded-md bg-white dark:bg-gray-800 px-3 py-2 text-sm font-medium leading-4 text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Invite
                </a>
              </div>
            </div>

            <div className="rounded-md bg-gray-50 dark:bg-gray-700 px-6 py-5 text-center">
              <ServerIcon className="mx-auto h-8 w-8 text-gray-400 dark:text-gray-500" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Upgrade Storage</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get more space for your files.</p>
              <div className="mt-4">
                <a
                  href="#"
                  className="inline-flex items-center rounded-md bg-white dark:bg-gray-800 px-3 py-2 text-sm font-medium leading-4 text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Upgrade
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
