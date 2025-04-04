import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const SubscriptionPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const planParam = searchParams.get('plan');
  
  const [selectedPlan, setSelectedPlan] = useState(planParam || 'pro');
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  
  const plans = [
    {
      name: 'Free',
      id: 'free',
      price: { monthly: '$0', annually: '$0' },
      description: 'Perfect for individuals and small projects.',
      features: [
        'Up to 5 users',
        '1 GB storage',
        'Basic analytics',
        'Email support',
        'Community access',
      ],
    },
    {
      name: 'Pro',
      id: 'pro',
      price: { monthly: '$29', annually: '$290' },
      description: 'Ideal for growing businesses and teams.',
      features: [
        'Up to 20 users',
        '10 GB storage',
        'Advanced analytics',
        'Priority email support',
        'API access',
        'Custom integrations',
        'Team collaboration tools',
      ],
    },
    {
      name: 'Enterprise',
      id: 'enterprise',
      price: { monthly: '$99', annually: '$990' },
      description: 'For large organizations with advanced needs.',
      features: [
        'Unlimited users',
        '100 GB storage',
        'Enterprise analytics',
        '24/7 phone & email support',
        'Advanced security',
        'Custom branding',
        'Dedicated account manager',
        'Single sign-on (SSO)',
        'Custom contract',
      ],
    },
  ];

  // Find the selected plan object
  const plan = plans.find((p) => p.id === selectedPlan) || plans[1]; // Default to Pro if not found

  // Set the plan based on URL parameter when component mounts
  useEffect(() => {
    if (planParam && plans.some((p) => p.id === planParam)) {
      setSelectedPlan(planParam);
    }
  }, [planParam]);

  const handlePlanChange = (planId) => {
    setSelectedPlan(planId);
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError('');

    try {
      // In a real application, you would call your API to handle the subscription
      // For this template, we'll simulate a successful subscription after a delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Redirect to the billing page after successful subscription
      navigate('/dashboard/billing');
    } catch (err) {
      setError('An error occurred while processing your subscription. Please try again.');
      console.error('Subscription error:', err);
      setIsProcessing(false);
    }
  };

  return (
    <div className="py-10">
      <header>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white">
            {selectedPlan === 'free' ? 'Downgrade to Free Plan' : `Upgrade to ${plan.name} Plan`}
          </h1>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="px-4 py-8 sm:px-0">
            <div className="rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="px-4 py-5 sm:p-6">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  {/* Plan Details */}
                  <div>
                    <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Plan Details</h3>
                    <div className="mt-5 space-y-6">
                      {/* Plan Selection */}
                      <div>
                        <label className="text-base font-medium text-gray-900 dark:text-white">Select a plan</label>
                        <fieldset className="mt-4">
                          <legend className="sr-only">Plan</legend>
                          <div className="space-y-4">
                            {plans.map((p) => (
                              <div key={p.id} className="flex items-center">
                                <input
                                  id={p.id}
                                  name="plan"
                                  type="radio"
                                  checked={selectedPlan === p.id}
                                  onChange={() => handlePlanChange(p.id)}
                                  className="h-4 w-4 border-gray-300 dark:border-gray-600 text-primary-600 dark:text-primary-500 focus:ring-primary-600 dark:focus:ring-primary-500"
                                />
                                <label htmlFor={p.id} className="ml-3 block text-sm font-medium leading-6 text-gray-900 dark:text-white">
                                  {p.name} ({billingCycle === 'monthly' ? p.price.monthly : p.price.annually}
                                  {p.id !== 'free' && <span className="text-gray-500 dark:text-gray-400">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>})
                                </label>
                              </div>
                            ))}
                          </div>
                        </fieldset>
                      </div>

                      {/* Billing Cycle */}
                      <div>
                        <label className="text-base font-medium text-gray-900 dark:text-white">Billing cycle</label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Choose how you want to be billed.</p>
                        <fieldset className="mt-4">
                          <legend className="sr-only">Billing cycle</legend>
                          <div className="space-y-4">
                            <div className="flex items-center">
                              <input
                                id="monthly"
                                name="billingCycle"
                                type="radio"
                                checked={billingCycle === 'monthly'}
                                onChange={() => setBillingCycle('monthly')}
                                className="h-4 w-4 border-gray-300 dark:border-gray-600 text-primary-600 dark:text-primary-500 focus:ring-primary-600 dark:focus:ring-primary-500"
                              />
                              <label htmlFor="monthly" className="ml-3 block text-sm font-medium leading-6 text-gray-900 dark:text-white">
                                Monthly
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input
                                id="annually"
                                name="billingCycle"
                                type="radio"
                                checked={billingCycle === 'annually'}
                                onChange={() => setBillingCycle('annually')}
                                className="h-4 w-4 border-gray-300 dark:border-gray-600 text-primary-600 dark:text-primary-500 focus:ring-primary-600 dark:focus:ring-primary-500"
                              />
                              <label htmlFor="annually" className="ml-3 block text-sm font-medium leading-6 text-gray-900 dark:text-white">
                                Annually <span className="text-primary-600 dark:text-primary-400">(Save 20%)</span>
                              </label>
                            </div>
                          </div>
                        </fieldset>
                      </div>
                    </div>
                  </div>

                  {/* Plan Summary */}
                  <div>
                    <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Summary</h3>
                    <div className="mt-5 rounded-lg bg-gray-50 dark:bg-gray-800 p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{plan.name} Plan</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Billed {billingCycle === 'monthly' ? 'monthly' : 'annually'}
                          </p>
                        </div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {billingCycle === 'monthly' ? plan.price.monthly : plan.price.annually}
                        </p>
                      </div>
                      <div className="mt-6">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">Included features</h4>
                        <ul role="list" className="mt-2 space-y-2 text-sm text-gray-500 dark:text-gray-400">
                          {plan.features.map((feature) => (
                            <li key={feature} className="flex items-start">
                              <svg className="h-5 w-5 flex-shrink-0 text-green-500 dark:text-green-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                              </svg>
                              <span className="ml-2">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                        <div className="flex items-center justify-between">
                          <p className="text-base font-medium text-gray-900 dark:text-white">Total</p>
                          <p className="text-base font-medium text-gray-900 dark:text-white">
                            {billingCycle === 'monthly' ? plan.price.monthly : plan.price.annually}
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                            </span>
                          </p>
                        </div>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          {selectedPlan === 'free'
                            ? 'You will not be charged for the Free plan.'
                            : 'You will be charged immediately and then on a recurring basis.'}
                        </p>
                      </div>

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

                      <div className="mt-6">
                        <button
                          type="button"
                          onClick={handleSubscribe}
                          disabled={isProcessing}
                          className="w-full rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isProcessing
                            ? 'Processing...'
                            : selectedPlan === 'free'
                            ? 'Downgrade to Free'
                            : `Subscribe to ${plan.name}`}
                        </button>
                      </div>
                      <div className="mt-4 text-center">
                        <button
                          type="button"
                          onClick={() => navigate('/dashboard/billing')}
                          className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                        >
                          Cancel
                        </button>
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

export default SubscriptionPage;
