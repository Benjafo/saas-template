import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../utils/api';

const PricingPage = () => {
  const [annual, setAnnual] = useState(true);
  const [tiers, setTiers] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
//   console.log('Pricing page component loaded')

  useEffect(() => {
    const fetchData = async () => {
      console.log('Pricing page loaded, data fetching')
      try {
        setLoading(true);
        
        // Fetch subscription plans
        const plansResponse = await apiClient.get('/config/subscription-plans');
        console.log('API response: ', plansResponse);
        const plans = plansResponse.data.data.plans;
        
        // Transform plans data to match the expected format for tiers
        const formattedTiers = plans.map(plan => ({
          name: plan.name,
          id: `tier-${plan.id}`,
          href: `/register${plan.id !== 'free' ? `?plan=${plan.id}` : ''}`,
          price: { 
            monthly: plan.price.monthly.display, 
            annually: plan.price.annually.display 
          },
          description: plan.description,
          features: plan.featuresList,
          mostPopular: plan.mostPopular,
        }));
        
        setTiers(formattedTiers);
        console.log('Tier data loaded from database')
        
        // Fetch marketing content (FAQs)
        const marketingResponse = await apiClient.get('/config/marketing-content');
        const marketingContent = marketingResponse.data.data.marketingContent;
        
        if (marketingContent && marketingContent.faqs) {
          setFaqs(marketingContent.faqs);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching pricing data:', err);
        setError('Failed to load pricing information. Please try again later.');
        setLoading(false);
        
        // Fallback to default data if API fails
        setTiers([
          {
            name: 'Broken',
            id: 'tier-free',
            href: '/register',
            price: { monthly: '$0', annually: '$0' },
            description: 'Something went wrong.',
            features: [
              'Oops',
              'Bad',
              'Shouldnt be seeing this',
              'Rats',
              'Darn it',
            ],
            mostPopular: false,
          },
        //   {
        //     name: 'Free',
        //     id: 'tier-free',
        //     href: '/register',
        //     price: { monthly: '$0', annually: '$0' },
        //     description: 'Perfect for individuals and small projects.',
        //     features: [
        //       'Up to 5 users',
        //       '1 GB storage',
        //       'Basic analytics',
        //       'Email support',
        //       'Community access',
        //     ],
        //     mostPopular: false,
        //   },
        //   {
        //     name: 'Pro',
        //     id: 'tier-pro',
        //     href: '/register?plan=pro',
        //     price: { monthly: '$29', annually: '$290' },
        //     description: 'Ideal for growing businesses and teams.',
        //     features: [
        //       'Up to 20 users',
        //       '10 GB storage',
        //       'Advanced analytics',
        //       'Priority email support',
        //       'API access',
        //       'Custom integrations',
        //       'Team collaboration tools',
        //     ],
        //     mostPopular: true,
        //   },
        //   {
        //     name: 'Enterprise',
        //     id: 'tier-enterprise',
        //     href: '/register?plan=enterprise',
        //     price: { monthly: '$99', annually: '$990' },
        //     description: 'For large organizations with advanced needs.',
        //     features: [
        //       'Unlimited users',
        //       '100 GB storage',
        //       'Enterprise analytics',
        //       '24/7 phone & email support',
        //       'Advanced security',
        //       'Custom branding',
        //       'Dedicated account manager',
        //       'Single sign-on (SSO)',
        //       'Custom contract',
        //     ],
        //     mostPopular: false,
        //   },
        ]);
        
        setFaqs([
          {
            question: 'Can I try before I buy?',
            answer:
              'Yes, you can start with our free tier to explore the platform. We also offer a 14-day free trial on all paid plans with no credit card required.',
          },
          {
            question: 'How do I upgrade or downgrade my plan?',
            answer:
              'You can change your plan at any time from your account settings. If you upgrade, you\'ll be charged the prorated amount for the remainder of your billing cycle. If you downgrade, you\'ll receive credit towards future bills.',
          },
          {
            question: 'Do you offer discounts for non-profits or educational institutions?',
            answer:
              'Yes, we offer special pricing for non-profit organizations, educational institutions, and open-source projects. Please contact our sales team for more information.',
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

  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="relative isolate overflow-hidden bg-gradient-to-b from-primary-100/20 dark:from-primary-900/20">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
              Simple, transparent pricing
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Choose the plan that's right for you and your team. All plans include a 14-day free trial.
            </p>
          </div>
        </div>
      </div>

      {/* Pricing section */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Toggle */}
          <div className="flex justify-center">
            <div className="relative flex rounded-full bg-gray-100 dark:bg-gray-800 p-1 mb-16">
              <button
                type="button"
                className={`${
                  !annual
                    ? 'bg-white dark:bg-gray-700 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400'
                } relative rounded-full py-2 px-6 text-sm font-medium whitespace-nowrap focus:outline-none focus:z-10`}
                onClick={() => setAnnual(false)}
              >
                Monthly
              </button>
              <button
                type="button"
                className={`${
                  annual
                    ? 'bg-white dark:bg-gray-700 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400'
                } relative ml-0.5 rounded-full py-2 px-6 text-sm font-medium whitespace-nowrap focus:outline-none focus:z-10`}
                onClick={() => setAnnual(true)}
              >
                Annual <span className="text-primary-600 dark:text-primary-400">Save 20%</span>
              </button>
            </div>
          </div>

          {/* Pricing cards */}
          <div className="isolate mx-auto grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {tiers.map((tier) => (
              <div
                key={tier.id}
                className={`${
                  tier.mostPopular
                    ? 'ring-2 ring-primary-600 dark:ring-primary-500'
                    : 'ring-1 ring-gray-200 dark:ring-gray-700'
                } rounded-3xl p-8 xl:p-10`}
              >
                <div className="flex items-center justify-between gap-x-4">
                  <h3 id={tier.id} className="text-lg font-semibold leading-8 text-gray-900 dark:text-white">
                    {tier.name}
                  </h3>
                  {tier.mostPopular ? (
                    <p className="rounded-full bg-primary-600/10 px-2.5 py-1 text-xs font-semibold leading-5 text-primary-600 dark:text-primary-400">
                      Most popular
                    </p>
                  ) : null}
                </div>
                <p className="mt-4 text-sm leading-6 text-gray-600 dark:text-gray-300">{tier.description}</p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {annual ? tier.price.annually : tier.price.monthly}
                  </span>
                  <span className="text-sm font-semibold leading-6 text-gray-600 dark:text-gray-300">
                    {annual ? '/year' : '/month'}
                  </span>
                </p>
                <Link
                  to={tier.href}
                  aria-describedby={tier.id}
                  className={`${
                    tier.mostPopular
                      ? 'bg-primary-600 text-white shadow-sm hover:bg-primary-500 focus-visible:outline-primary-600'
                      : 'bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 ring-1 ring-inset ring-primary-200 dark:ring-primary-700 hover:ring-primary-300 dark:hover:ring-primary-600 focus-visible:outline-primary-600'
                  } mt-6 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`}
                >
                  {tier.mostPopular ? 'Start free trial' : 'Get started'}
                </Link>
                <ul className="mt-8 space-y-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <svg className="h-6 w-5 flex-none text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQs */}
      <div className="bg-gray-50 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
          <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900 dark:text-white">
            Frequently asked questions
          </h2>
          <div className="mt-10 space-y-6 divide-y divide-gray-900/10 dark:divide-gray-700">
            {faqs.map((faq) => (
              <div key={faq.question} className="pt-6">
                <dt>
                  <h3 className="text-base font-semibold leading-7 text-gray-900 dark:text-white">{faq.question}</h3>
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-300">{faq.answer}</dd>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="relative isolate overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Still have questions?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600 dark:text-gray-300">
              Our team is ready to help you find the perfect plan for your needs.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                to="/contact"
                className="rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
              >
                Contact sales
              </Link>
              <Link to="/register" className="text-sm font-semibold leading-6 text-gray-900 dark:text-white">
                Start free trial <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
