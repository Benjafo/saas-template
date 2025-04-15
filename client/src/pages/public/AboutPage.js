import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Hero section */}
      <div className="relative isolate overflow-hidden bg-gradient-to-b from-primary-100/20 dark:from-primary-900/20">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-3xl">
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
              About Us
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              We're on a mission to build the most powerful and user-friendly SaaS platform that helps businesses grow and succeed in the digital age.
            </p>
          </div>
        </div>
      </div>

      {/* Values section */}
      <div className="mx-auto mt-16 max-w-7xl px-6 sm:mt-20 md:mt-24 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Our values</h2>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Our values guide everything we do. They're the foundation of our company culture and the principles that drive our decision-making.
          </p>
        </div>
        <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 text-base leading-7 text-gray-600 dark:text-gray-300 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:gap-x-16">
          <div className="relative pl-10">
            <dt className="inline font-semibold text-gray-900 dark:text-white">
              <svg className="absolute left-1 top-1 h-5 w-5 text-primary-600 dark:text-primary-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
              </svg>
              Customer-first.
            </dt>
            <dd className="inline"> Our customers are at the center of everything we do. We listen to their needs and build solutions that solve real problems.</dd>
          </div>
          <div className="relative pl-10">
            <dt className="inline font-semibold text-gray-900 dark:text-white">
              <svg className="absolute left-1 top-1 h-5 w-5 text-primary-600 dark:text-primary-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
              </svg>
              Innovation.
            </dt>
            <dd className="inline"> We're constantly pushing the boundaries of what's possible, exploring new technologies and approaches to deliver the best solutions.</dd>
          </div>
          <div className="relative pl-10">
            <dt className="inline font-semibold text-gray-900 dark:text-white">
              <svg className="absolute left-1 top-1 h-5 w-5 text-primary-600 dark:text-primary-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
              </svg>
              Transparency.
            </dt>
            <dd className="inline"> We believe in open and honest communication, both within our team and with our customers and partners.</dd>
          </div>
          <div className="relative pl-10">
            <dt className="inline font-semibold text-gray-900 dark:text-white">
              <svg className="absolute left-1 top-1 h-5 w-5 text-primary-600 dark:text-primary-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
              </svg>
              Quality.
            </dt>
            <dd className="inline"> We're committed to delivering high-quality products and services that exceed expectations and stand the test of time.</dd>
          </div>
        </dl>
      </div>

      {/* Team section */}
      <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Our team</h2>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            We're a diverse group of passionate individuals working together to build something great.
          </p>
        </div>
        <ul className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 xl:grid-cols-4">
          {[
            {
              name: 'Jane Cooper',
              role: 'CEO & Co-Founder',
              imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
            },
            {
              name: 'Michael Foster',
              role: 'CTO & Co-Founder',
              imageUrl: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
            },
            {
              name: 'Dries Vincent',
              role: 'Head of Design',
              imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
            },
            {
              name: 'Lindsay Walton',
              role: 'Lead Developer',
              imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
            },
          ].map((person) => (
            <li key={person.name}>
              <img className="aspect-[14/13] w-full rounded-2xl object-cover" src={person.imageUrl} alt="" />
              <h3 className="mt-6 text-lg font-semibold leading-8 text-gray-900 dark:text-white">{person.name}</h3>
              <p className="text-base leading-7 text-gray-600 dark:text-gray-400">{person.role}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA section */}
      <div className="relative isolate mt-32 px-6 py-32 sm:mt-40 sm:py-40 lg:px-8">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-[max(50%,25rem)] top-0 h-[64rem] w-[128rem] -translate-x-1/2 stroke-gray-200 dark:stroke-gray-700 [mask-image:radial-gradient(64rem_64rem_at_top,white,transparent)]">
            <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
              <defs>
                <pattern id="e813992c-7d03-4cc4-a2bd-151760b470a0" width="200" height="200" x="50%" y="-1" patternUnits="userSpaceOnUse">
                  <path d="M100 200V.5M.5 .5H200" fill="none" />
                </pattern>
              </defs>
              <svg x="50%" y="-1" className="overflow-visible fill-gray-50 dark:fill-gray-800">
                <path d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z" strokeWidth="0" />
              </svg>
              <rect width="100%" height="100%" strokeWidth="0" fill="url(#e813992c-7d03-4cc4-a2bd-151760b470a0)" />
            </svg>
          </div>
        </div>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Ready to get started?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600 dark:text-gray-300">
            Join thousands of businesses that are already using our platform to grow and succeed.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              to="/register"
              className="rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
            >
              Get started
            </Link>
            <Link to="/contact" className="text-sm font-semibold leading-6 text-gray-900 dark:text-white">
              Contact us <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
