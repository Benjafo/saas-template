import { useFormik } from 'formik';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useAuth } from '../../context/AuthContext';

const RegisterPage = () => {
  const { register, loginWithGoogle, loginWithGitHub } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSocialLoading, setIsSocialLoading] = useState({
    google: false,
    github: false
  });
  const [error, setError] = useState('');

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      passwordConfirm: '',
      acceptTerms: false,
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string()
        .min(8, 'Must be at least 8 characters')
        .required('Required'),
      passwordConfirm: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Required'),
      acceptTerms: Yup.boolean()
        .required('Required')
        .oneOf([true], 'You must accept the terms and conditions'),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      setError('');
      
      try {
        const result = await register({
          name: values.name,
          email: values.email,
          password: values.password,
          passwordConfirm: values.passwordConfirm,
        });
        
        if (result.success) {
          navigate('/dashboard');
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError('An unexpected error occurred. Please try again.');
        console.error('Registration error:', err);
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white dark:bg-gray-800 px-6 py-12 shadow sm:rounded-lg sm:px-12">
          {error && (
            <div className="mb-4 rounded-md bg-danger-50 dark:bg-danger-900 p-4">
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

          <form className="space-y-6" onSubmit={formik.handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
                Full name
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className={`block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ${
                    formik.touched.name && formik.errors.name
                      ? 'ring-danger-300 dark:ring-danger-600 focus:ring-danger-500 dark:focus:ring-danger-400'
                      : 'ring-gray-300 dark:ring-gray-600 focus:ring-primary-600 dark:focus:ring-primary-500'
                  } placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 dark:bg-gray-700`}
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.name && formik.errors.name ? (
                  <p className="mt-2 text-sm text-danger-600 dark:text-danger-400">{formik.errors.name}</p>
                ) : null}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={`block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ${
                    formik.touched.email && formik.errors.email
                      ? 'ring-danger-300 dark:ring-danger-600 focus:ring-danger-500 dark:focus:ring-danger-400'
                      : 'ring-gray-300 dark:ring-gray-600 focus:ring-primary-600 dark:focus:ring-primary-500'
                  } placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 dark:bg-gray-700`}
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.email && formik.errors.email ? (
                  <p className="mt-2 text-sm text-danger-600 dark:text-danger-400">{formik.errors.email}</p>
                ) : null}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className={`block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ${
                    formik.touched.password && formik.errors.password
                      ? 'ring-danger-300 dark:ring-danger-600 focus:ring-danger-500 dark:focus:ring-danger-400'
                      : 'ring-gray-300 dark:ring-gray-600 focus:ring-primary-600 dark:focus:ring-primary-500'
                  } placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 dark:bg-gray-700`}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.password && formik.errors.password ? (
                  <p className="mt-2 text-sm text-danger-600 dark:text-danger-400">{formik.errors.password}</p>
                ) : null}
              </div>
            </div>

            <div>
              <label htmlFor="passwordConfirm" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
                Confirm password
              </label>
              <div className="mt-2">
                <input
                  id="passwordConfirm"
                  name="passwordConfirm"
                  type="password"
                  autoComplete="new-password"
                  required
                  className={`block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ${
                    formik.touched.passwordConfirm && formik.errors.passwordConfirm
                      ? 'ring-danger-300 dark:ring-danger-600 focus:ring-danger-500 dark:focus:ring-danger-400'
                      : 'ring-gray-300 dark:ring-gray-600 focus:ring-primary-600 dark:focus:ring-primary-500'
                  } placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 dark:bg-gray-700`}
                  value={formik.values.passwordConfirm}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.passwordConfirm && formik.errors.passwordConfirm ? (
                  <p className="mt-2 text-sm text-danger-600 dark:text-danger-400">{formik.errors.passwordConfirm}</p>
                ) : null}
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="acceptTerms"
                name="acceptTerms"
                type="checkbox"
                className={`h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-primary-600 dark:text-primary-500 focus:ring-primary-600 dark:focus:ring-primary-500 dark:bg-gray-700 ${
                  formik.touched.acceptTerms && formik.errors.acceptTerms
                    ? 'border-danger-300 dark:border-danger-600'
                    : ''
                }`}
                checked={formik.values.acceptTerms}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <label htmlFor="acceptTerms" className="ml-3 block text-sm leading-6 text-gray-700 dark:text-gray-300">
                I agree to the{' '}
                <Link to="/terms" className="font-semibold text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="font-semibold text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                  Privacy Policy
                </Link>
              </label>
            </div>
            {formik.touched.acceptTerms && formik.errors.acceptTerms ? (
              <p className="mt-2 text-sm text-danger-600 dark:text-danger-400">{formik.errors.acceptTerms}</p>
            ) : null}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full justify-center rounded-md bg-primary-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating account...' : 'Create account'}
              </button>
            </div>
          </form>

          <div>
            <div className="relative mt-10">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-200 dark:border-gray-700" />
              </div>
              <div className="relative flex justify-center text-sm font-medium leading-6">
                <span className="bg-white dark:bg-gray-800 px-6 text-gray-900 dark:text-gray-200">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={async () => {
                  setError('');
                  setIsSocialLoading(prev => ({ ...prev, google: true }));
                  try {
                    const result = await loginWithGoogle();
                    if (result.success) {
                      navigate('/dashboard');
                    } else {
                      setError(result.message);
                    }
                  } catch (err) {
                    setError('An unexpected error occurred. Please try again.');
                    console.error('Google login error:', err);
                  } finally {
                    setIsSocialLoading(prev => ({ ...prev, google: false }));
                  }
                }}
                disabled={isSocialLoading.google}
                className="flex w-full items-center justify-center gap-3 rounded-md bg-white dark:bg-gray-700 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 focus-visible:ring-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
                  <path
                    d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                    fill="#EA4335"
                  />
                  <path
                    d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
                    fill="#34A853"
                  />
                </svg>
                <span className="text-sm font-semibold leading-6">
                  {isSocialLoading.google ? 'Signing in...' : 'Google'}
                </span>
              </button>

              <button
                type="button"
                onClick={async () => {
                  setError('');
                  setIsSocialLoading(prev => ({ ...prev, github: true }));
                  try {
                    const result = await loginWithGitHub();
                    if (result.success) {
                      navigate('/dashboard');
                    } else {
                      setError(result.message);
                    }
                  } catch (err) {
                    setError('An unexpected error occurred. Please try again.');
                    console.error('GitHub login error:', err);
                  } finally {
                    setIsSocialLoading(prev => ({ ...prev, github: false }));
                  }
                }}
                disabled={isSocialLoading.github}
                className="flex w-full items-center justify-center gap-3 rounded-md bg-white dark:bg-gray-700 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 focus-visible:ring-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="h-5 w-5 fill-[#24292F] dark:fill-white" aria-hidden="true" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm font-semibold leading-6">
                  {isSocialLoading.github ? 'Signing in...' : 'GitHub'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
