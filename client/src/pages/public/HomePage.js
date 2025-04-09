import { CheckIcon } from '@heroicons/react/20/solid';
import React from 'react';
import { Link } from 'react-router-dom';

const features = [
  {
    name: 'Multi-tenancy',
    description: 'Isolate data and configuration for each customer with our robust multi-tenant architecture.',
  },
  {
    name: 'User Management',
    description: 'Comprehensive user management with roles, permissions, and team collaboration features.',
  },
  {
    name: 'Subscription Billing',
    description: 'Flexible subscription plans with Stripe integration for seamless billing and payments.',
  },
  {
    name: 'White Labeling',
    description: 'Customize the look and feel with your own branding, colors, and domain.',
  },
  {
    name: 'API Access',
    description: 'Integrate with your existing systems using our comprehensive REST API.',
  },
  {
    name: 'Analytics Dashboard',
    description: 'Gain insights into usage patterns and business metrics with detailed analytics.',
  },
];

const tiers = [
  {
    name: 'Free',
    id: 'tier-free',
    href: '/register',
    price: { monthly: '$0' },
    description: 'The essentials to provide your best work for clients.',
    features: ['5 users', '1 GB storage', 'Basic analytics', 'Email support'],
    mostPopular: false,
  },
  {
    name: 'Starter',
    id: 'tier-starter',
    href: '/register',
    price: { monthly: '$19' },
    description: 'A plan that scales with your rapidly growing business.',
    features: [
      '25 users',
      '10 GB storage',
      'Advanced analytics',
      'Priority email support',
      'Custom domain',
      'API access',
    ],
    mostPopular: true,
  },
  {
    name: 'Enterprise',
    id: 'tier-enterprise',
    href: '/register',
    price: { monthly: '$49' },
    description: 'Dedicated support and infrastructure for your company.',
    features: [
      'Unlimited users',
      '100 GB storage',
      'Advanced analytics',
      '24/7 phone support',
      'Custom domain',
      'API access',
      'White labeling',
      'Custom integrations',
    ],
    mostPopular: false,
  },
];

const faqs = [
  {
    id: 1,
    question: "What's the best thing about this SaaS template?",
    answer:
      "The best thing about this SaaS template is that it comes with all the essential features you need to launch your SaaS product quickly. It includes authentication, subscription management, multi-tenancy, and more, saving you months of development time.",
  },
  {
    id: 2,
    question: 'How do I customize the template for my needs?',
    answer:
      'The template is built with modularity in mind. You can easily customize the components, styles, and functionality to match your specific requirements. The code is well-organized and documented to make customization straightforward.',
  },
  {
    id: 3,
    question: 'What technologies are used in this template?',
    answer:
      'This template uses React for the frontend, Node.js with Express for the backend, MongoDB for the database, and integrates with Stripe for payment processing. It also uses modern tools like Tailwind CSS for styling and JWT for authentication.',
  },
  {
    id: 4,
    question: 'Is this template suitable for my SaaS idea?',
    answer:
      'This template is designed to be a starting point for a wide range of SaaS applications. It provides the common infrastructure needed by most SaaS products, allowing you to focus on building your unique features and value proposition.',
  },
];

const HomePage = () => {
  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Hero section */}
      <div className="relative isolate overflow-hidden">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary-600 to-secondary-600 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
              AAAALaunch Your SaaS Product Faster
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              A complete starter template for building your SaaS application. Authentication, billing, multi-tenancy, and
              more - all pre-built so you can focus on your core features.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                to="/register"
                className="rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
              >
                Get started
              </Link>
              <Link to="/features" className="text-sm font-semibold leading-6 text-gray-900 dark:text-white">
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
          <div
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-primary-600 to-secondary-600 opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
      </div>

      {/* Feature section */}
      <div className="mx-auto mt-16 max-w-7xl px-6 sm:mt-20 md:mt-24 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-primary-600 dark:text-primary-400">Everything you need</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            All-in-one platform
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Our SaaS template includes everything you need to build, launch, and scale your SaaS product.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900 dark:text-white">
                  <div className="h-5 w-5 flex-none rounded-full bg-primary-600 dark:bg-primary-500" />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-300">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Pricing section */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-base font-semibold leading-7 text-primary-600 dark:text-primary-400">Pricing</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Plans for teams of all sizes
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Choose the plan that's right for you. All plans include a 14-day free trial.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-3">
            {tiers.map((tier, tierIdx) => (
              <div
                key={tier.id}
                className={`${
                  tier.mostPopular
                    ? 'relative bg-white dark:bg-gray-800 shadow-2xl dark:shadow-gray-700/20 z-10 rounded-xl'
                    : 'bg-white/60 dark:bg-gray-800/60 sm:mx-8 lg:mx-0 rounded-xl sm:rounded-none sm:first:rounded-l-xl sm:last:rounded-r-xl'
                } flex flex-col justify-between p-8 ring-1 ring-gray-200 dark:ring-gray-700 xl:p-10`}
              >
                <div>
                  <div className="flex items-center justify-between gap-x-4">
                    <h3
                      id={tier.id}
                      className={`text-lg font-semibold leading-8 ${
                        tier.mostPopular ? 'text-primary-600 dark:text-primary-400' : 'text-gray-900 dark:text-white'
                      }`}
                    >
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
                      {tier.price.monthly}
                    </span>
                    <span className="text-sm font-semibold leading-6 text-gray-600 dark:text-gray-300">/month</span>
                  </p>
                  <ul className="mt-8 space-y-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex gap-x-3">
                        <CheckIcon className="h-6 w-5 flex-none text-primary-600 dark:text-primary-400" aria-hidden="true" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  to={tier.href}
                  aria-describedby={tier.id}
                  className={`${
                    tier.mostPopular
                      ? 'bg-primary-600 text-white shadow-sm hover:bg-primary-500'
                      : 'text-primary-600 dark:text-primary-400 ring-1 ring-inset ring-primary-200 dark:ring-primary-700 hover:ring-primary-300 dark:hover:ring-primary-600'
                  } mt-8 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600`}
                >
                  Get started today
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ section */}
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
        <div className="mx-auto max-w-4xl divide-y divide-gray-900/10 dark:divide-gray-100/10">
          <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900 dark:text-white">
            Frequently asked questions
          </h2>
          <dl className="mt-10 space-y-6 divide-y divide-gray-900/10 dark:divide-gray-100/10">
            {faqs.map((faq) => (
              <div key={faq.id} className="pt-6">
                <dt>
                  <div className="text-lg font-semibold leading-7 text-gray-900 dark:text-white">{faq.question}</div>
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-300">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-primary-600 dark:bg-primary-700">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to get started?
            <br />
            Start your free trial today.
          </h2>
          <p className="mt-6 text-lg leading-8 text-primary-100">
            Join thousands of companies using our SaaS template to build their products.
          </p>
          <div className="mt-10 flex items-center gap-x-6">
            <Link
              to="/register"
              className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-primary-600 shadow-sm hover:bg-primary-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Get started
            </Link>
            <Link to="/contact" className="text-sm font-semibold leading-6 text-white">
              Contact sales <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
