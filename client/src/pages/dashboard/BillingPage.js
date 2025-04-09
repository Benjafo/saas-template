import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const BillingPage = () => {
  const { user } = useAuth();
  const [currentPlan, setCurrentPlan] = useState('');
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [paymentMethod, setPaymentMethod] = useState({
    type: 'card',
    last4: '4242',
    expiry: '04/25',
    brand: 'Visa',
  });
  const [invoices, setInvoices] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch user subscription to get current plan
        const userSubscriptionRes = await axios.get('/users/subscription');
        const userSubscription = userSubscriptionRes.data.data.subscription;
        setCurrentPlan(userSubscription?.plan || 'free');
        
        // Fetch subscription plans
        const plansResponse = await axios.get('/config/subscription-plans');
        const plansData = plansResponse.data.data.plans;
        
        // Transform plans data to match the expected format
        const formattedPlans = plansData.map(plan => ({
          name: plan.name,
          id: plan.id,
          price: { 
            monthly: plan.price.monthly.display, 
            annually: plan.price.annually.display 
          },
          features: plan.featuresList.slice(0, 6), // Limit to 6 features for display
          current: userSubscription?.plan === plan.id,
        }));
        
        setPlans(formattedPlans);
        
        // Fetch invoices
        try {
          const invoicesRes = await axios.get('/seed/invoices');
          const invoicesData = invoicesRes.data.data.invoices;
          
          // Format invoices for display
          const formattedInvoices = invoicesData.slice(0, 3).map(invoice => ({
            id: invoice.invoiceNumber,
            date: new Date(invoice.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            amount: `$${invoice.amount.toFixed(2)}`,
            status: invoice.status === 'paid' ? 'Paid' : 'Unpaid',
            downloadUrl: '#',
          }));
          
          setInvoices(formattedInvoices);
        } catch (invoiceError) {
          console.warn('Could not fetch invoices:', invoiceError);
          // Use default invoices if API fails
          setInvoices([
            {
              id: 'INV-2025-001',
              date: 'Mar 1, 2025',
              amount: '$29.00',
              status: 'Paid',
              downloadUrl: '#',
            },
            {
              id: 'INV-2025-002',
              date: 'Feb 1, 2025',
              amount: '$29.00',
              status: 'Paid',
              downloadUrl: '#',
            },
            {
              id: 'INV-2025-003',
              date: 'Jan 1, 2025',
              amount: '$29.00',
              status: 'Paid',
              downloadUrl: '#',
            },
          ]);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching billing data:', err);
        setError('Failed to load billing information. Please try again later.');
        setLoading(false);
        
        // Fallback to default data if API fails
        setPlans([
          {
            name: 'Free',
            id: 'free',
            price: { monthly: '$0', annually: '$0' },
            features: [
              'Up to 5 users',
              '1 GB storage',
              'Basic analytics',
              'Email support',
            ],
            current: currentPlan === 'free',
          },
          {
            name: 'Pro',
            id: 'pro',
            price: { monthly: '$29', annually: '$290' },
            features: [
              'Up to 20 users',
              '10 GB storage',
              'Advanced analytics',
              'Priority email support',
              'API access',
            ],
            current: currentPlan === 'pro',
          },
          {
            name: 'Enterprise',
            id: 'enterprise',
            price: { monthly: '$99', annually: '$990' },
            features: [
              'Unlimited users',
              '100 GB storage',
              'Enterprise analytics',
              '24/7 phone & email support',
              'Advanced security',
              'Custom branding',
            ],
            current: currentPlan === 'enterprise',
          },
        ]);
      }
    };
    
    fetchData();
  }, []);
  
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
    <div className="py-10">
      <header>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white">Billing</h1>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="space-y-10">
            {/* Current Plan */}
            <div className="px-4 py-8 sm:px-0">
              <div className="rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Current Plan</h3>
                  <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {plans.map((plan) => (
                      <div
                        key={plan.id}
                        className={`relative rounded-lg border ${
                          plan.current
                            ? 'border-primary-600 dark:border-primary-500'
                            : 'border-gray-300 dark:border-gray-600'
                        } bg-white dark:bg-gray-800 p-4 shadow-sm focus:outline-none`}
                      >
                        <div className="flex justify-between">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{plan.name}</p>
                          {plan.current && (
                            <span className="inline-flex items-center rounded-full bg-primary-100 dark:bg-primary-900 px-2.5 py-0.5 text-xs font-medium text-primary-800 dark:text-primary-200">
                              Current plan
                            </span>
                          )}
                        </div>
                        <p className="mt-4 text-2xl font-semibold text-gray-900 dark:text-white">
                          {billingCycle === 'monthly' ? plan.price.monthly : plan.price.annually}
                          <span className="text-base font-normal text-gray-500 dark:text-gray-400">
                            /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                          </span>
                        </p>
                        <ul role="list" className="mt-4 space-y-3 text-sm text-gray-500 dark:text-gray-400">
                          {plan.features.map((feature) => (
                            <li key={feature} className="flex items-start">
                              <svg className="h-5 w-5 flex-shrink-0 text-green-500 dark:text-green-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                              </svg>
                              <span className="ml-2">{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-6">
                          {plan.current ? (
                            <button
                              type="button"
                              className="w-full rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                              disabled
                            >
                              Current plan
                            </button>
                          ) : (
                            <Link
                              to={`/dashboard/subscription?plan=${plan.id}`}
                              className="block w-full rounded-md bg-white dark:bg-gray-700 px-3 py-2 text-center text-sm font-semibold text-primary-600 dark:text-primary-400 shadow-sm ring-1 ring-inset ring-primary-300 dark:ring-primary-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                            >
                              {plan.id === 'free' ? 'Downgrade' : 'Upgrade'}
                            </Link>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6">
                    <div className="flex justify-center">
                      <div className="relative flex rounded-full bg-gray-100 dark:bg-gray-800 p-1">
                        <button
                          type="button"
                          className={`${
                            billingCycle === 'monthly'
                              ? 'bg-white dark:bg-gray-700 shadow-sm'
                              : 'text-gray-500 dark:text-gray-400'
                          } relative rounded-full py-2 px-6 text-sm font-medium whitespace-nowrap focus:outline-none focus:z-10`}
                          onClick={() => setBillingCycle('monthly')}
                        >
                          Monthly
                        </button>
                        <button
                          type="button"
                          className={`${
                            billingCycle === 'annually'
                              ? 'bg-white dark:bg-gray-700 shadow-sm'
                              : 'text-gray-500 dark:text-gray-400'
                          } relative ml-0.5 rounded-full py-2 px-6 text-sm font-medium whitespace-nowrap focus:outline-none focus:z-10`}
                          onClick={() => setBillingCycle('annually')}
                        >
                          Annually <span className="text-primary-600 dark:text-primary-400">Save 20%</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="px-4 py-8 sm:px-0">
              <div className="rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Payment Method</h3>
                  <div className="mt-5">
                    <div className="rounded-md bg-gray-50 dark:bg-gray-800 p-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          {paymentMethod.brand === 'Visa' && (
                            <svg className="h-8 w-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <rect width="32" height="32" rx="4" fill="#2566AF" />
                              <path d="M13.5 21.5H10L12.5 10.5H16L13.5 21.5Z" fill="white" />
                              <path d="M22.5 10.7C21.7 10.5 20.5 10.3 19.5 10.3C17 10.3 14 11.3 14 13.8C14 15.8 16.3 16.8 17.8 17.5C19.3 18.2 19.8 18.7 19.8 19.3C19.8 20.3 18.5 20.7 17.3 20.7C15.8 20.7 15 20.5 13.8 20L13.3 19.8L13 22.3C13.8 22.7 15.3 23 16.8 23C19.5 23 22.5 22 22.5 19.3C22.5 17.8 21.5 16.5 19.3 15.5C18 14.8 17.3 14.5 17.3 13.8C17.3 13.3 17.8 12.8 19 12.8C20 12.8 20.8 13 21.5 13.3L21.8 13.5L22.5 10.7Z" fill="white" />
                              <path d="M25.5 10.5H23C22.3 10.5 21.8 10.7 21.5 11.5L18 21.5H20.8C20.8 21.5 21.3 20.3 21.3 20C21.8 20 24.5 20 25.3 20C25.3 20.5 25.5 21.5 25.5 21.5H28L25.5 10.5ZM22.3 17.8C22.5 17.3 23.5 14.5 23.5 14.5C23.5 14.5 23.8 13.8 24 13.3L24.3 14.3C24.3 14.3 24.8 17.3 25 17.8H22.3Z" fill="white" />
                              <path d="M9 10.5L6.5 18L6.3 17C5.5 15 4 13 2 11.8L4.3 21.5H7L12 10.5H9Z" fill="white" />
                            </svg>
                          )}
                          {paymentMethod.brand === 'Mastercard' && (
                            <svg className="h-8 w-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <rect width="32" height="32" rx="4" fill="#F7F7F7" />
                              <path d="M16 23.5C20.1421 23.5 23.5 20.1421 23.5 16C23.5 11.8579 20.1421 8.5 16 8.5C11.8579 8.5 8.5 11.8579 8.5 16C8.5 20.1421 11.8579 23.5 16 23.5Z" fill="#FF5F00" />
                              <path d="M16 8.5C13.7536 8.5 11.6988 9.33899 10.1679 10.7683C10.9322 11.6344 11.5 12.6478 11.8284 13.7574C12.1569 14.867 12.2364 16.0389 12.0613 17.1837C11.8862 18.3285 11.4612 19.4191 10.8167 20.3818C10.1721 21.3445 9.32591 22.1551 8.33333 22.75C9.86419 24.1793 11.919 25.0183 14.1654 25.0183C16.4118 25.0183 18.4666 24.1793 19.9975 22.75C21.5283 21.3207 22.3673 19.2659 22.3673 17.0195C22.3673 14.7731 21.5283 12.7183 19.9975 11.189C18.4666 9.65972 16.4118 8.82073 14.1654 8.82073L16 8.5Z" fill="#EB001B" />
                              <path d="M23.6667 22.75C22.6741 22.1551 21.8279 21.3445 21.1833 20.3818C20.5388 19.4191 20.1138 18.3285 19.9387 17.1837C19.7636 16.0389 19.8431 14.867 20.1716 13.7574C20.5 12.6478 21.0678 11.6344 21.8321 10.7683C20.3012 9.33899 18.2464 8.5 16 8.5C13.7536 8.5 11.6988 9.33899 10.1679 10.7683C8.63717 12.1976 7.79818 14.2524 7.79818 16.4988C7.79818 18.7452 8.63717 20.8 10.1679 22.3309C11.6988 23.8618 13.7536 24.7008 16 24.7008C18.2464 24.7008 20.3012 23.8618 21.8321 22.4325L23.6667 22.75Z" fill="#F79E1B" />
                            </svg>
                          )}
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {paymentMethod.brand} ending in {paymentMethod.last4}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Expires {paymentMethod.expiry}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex">
                      <button
                        type="button"
                        className="rounded-md bg-white dark:bg-gray-700 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                      >
                        Update payment method
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Billing History */}
            <div className="px-4 py-8 sm:px-0">
              <div className="rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Billing History</h3>
                  <div className="mt-5 flow-root">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                      <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                          <thead>
                            <tr>
                              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-0">
                                Invoice
                              </th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                Date
                              </th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                Amount
                              </th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                Status
                              </th>
                              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                                <span className="sr-only">Download</span>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                            {invoices.map((invoice) => (
                              <tr key={invoice.id}>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-0">
                                  {invoice.id}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                                  {invoice.date}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                                  {invoice.amount}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                                  <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:text-green-200">
                                    {invoice.status}
                                  </span>
                                </td>
                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                                  <a href={invoice.downloadUrl} className="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300">
                                    Download<span className="sr-only">, {invoice.id}</span>
                                  </a>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BillingPage;
