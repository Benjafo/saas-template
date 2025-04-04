import React, { useState } from 'react';

const SettingsAdminPage = () => {
  // General Settings
  const [siteName, setSiteName] = useState('SaaS Platform');
  const [siteDescription, setSiteDescription] = useState('Multi-tenant SaaS application platform');
  const [supportEmail, setSupportEmail] = useState('support@example.com');
  const [adminEmail, setAdminEmail] = useState('admin@example.com');
  
  // Security Settings
  const [passwordMinLength, setPasswordMinLength] = useState(8);
  const [passwordRequireUppercase, setPasswordRequireUppercase] = useState(true);
  const [passwordRequireNumbers, setPasswordRequireNumbers] = useState(true);
  const [passwordRequireSymbols, setPasswordRequireSymbols] = useState(false);
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(60);
  
  // Email Settings
  const [smtpHost, setSmtpHost] = useState('smtp.example.com');
  const [smtpPort, setSmtpPort] = useState(587);
  const [smtpUser, setSmtpUser] = useState('smtp_user');
  const [smtpPassword, setSmtpPassword] = useState('••••••••');
  const [smtpSecure, setSmtpSecure] = useState(true);
  const [emailFromName, setEmailFromName] = useState('SaaS Platform');
  const [emailFromAddress, setEmailFromAddress] = useState('noreply@example.com');
  
  // Subscription Settings
  const [trialDays, setTrialDays] = useState(14);
  const [allowFreeTier, setAllowFreeTier] = useState(true);
  const [autoRenewSubscriptions, setAutoRenewSubscriptions] = useState(true);
  const [sendRenewalReminders, setSendRenewalReminders] = useState(true);
  const [renewalReminderDays, setRenewalReminderDays] = useState([30, 15, 7, 1]);
  
  // API Settings
  const [enablePublicApi, setEnablePublicApi] = useState(true);
  const [apiRateLimit, setApiRateLimit] = useState(100);
  const [apiTokenExpiry, setApiTokenExpiry] = useState(30);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, this would save the settings to the backend
    console.log('Settings saved');
  };

  return (
    <div className="py-10">
      <header>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white">Admin Settings</h1>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="px-4 py-8 sm:px-0">
            <form onSubmit={handleSubmit}>
              {/* General Settings */}
              <div className="space-y-12">
                <div className="border-b border-gray-900/10 dark:border-gray-700 pb-12">
                  <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-white">General Settings</h2>
                  <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
                    Basic configuration for your SaaS platform.
                  </p>

                  <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label htmlFor="site-name" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
                        Site Name
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="site-name"
                          id="site-name"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 dark:focus:ring-primary-500 sm:text-sm sm:leading-6 dark:bg-gray-700"
                          value={siteName}
                          onChange={(e) => setSiteName(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="site-description" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
                        Site Description
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="site-description"
                          id="site-description"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 dark:focus:ring-primary-500 sm:text-sm sm:leading-6 dark:bg-gray-700"
                          value={siteDescription}
                          onChange={(e) => setSiteDescription(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="support-email" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
                        Support Email
                      </label>
                      <div className="mt-2">
                        <input
                          type="email"
                          name="support-email"
                          id="support-email"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 dark:focus:ring-primary-500 sm:text-sm sm:leading-6 dark:bg-gray-700"
                          value={supportEmail}
                          onChange={(e) => setSupportEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="admin-email" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
                        Admin Email
                      </label>
                      <div className="mt-2">
                        <input
                          type="email"
                          name="admin-email"
                          id="admin-email"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 dark:focus:ring-primary-500 sm:text-sm sm:leading-6 dark:bg-gray-700"
                          value={adminEmail}
                          onChange={(e) => setAdminEmail(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Security Settings */}
                <div className="border-b border-gray-900/10 dark:border-gray-700 pb-12">
                  <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-white">Security Settings</h2>
                  <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
                    Configure security options for your platform.
                  </p>

                  <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label htmlFor="password-min-length" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
                        Minimum Password Length
                      </label>
                      <div className="mt-2">
                        <input
                          type="number"
                          name="password-min-length"
                          id="password-min-length"
                          min="6"
                          max="32"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 dark:focus:ring-primary-500 sm:text-sm sm:leading-6 dark:bg-gray-700"
                          value={passwordMinLength}
                          onChange={(e) => setPasswordMinLength(parseInt(e.target.value))}
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="session-timeout" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
                        Session Timeout (minutes)
                      </label>
                      <div className="mt-2">
                        <input
                          type="number"
                          name="session-timeout"
                          id="session-timeout"
                          min="5"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 dark:focus:ring-primary-500 sm:text-sm sm:leading-6 dark:bg-gray-700"
                          value={sessionTimeout}
                          onChange={(e) => setSessionTimeout(parseInt(e.target.value))}
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-6">
                      <div className="space-y-6">
                        <div className="relative flex gap-x-3">
                          <div className="flex h-6 items-center">
                            <input
                              id="password-require-uppercase"
                              name="password-require-uppercase"
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-primary-600 dark:text-primary-500 focus:ring-primary-600 dark:focus:ring-primary-500"
                              checked={passwordRequireUppercase}
                              onChange={(e) => setPasswordRequireUppercase(e.target.checked)}
                            />
                          </div>
                          <div className="text-sm leading-6">
                            <label htmlFor="password-require-uppercase" className="font-medium text-gray-900 dark:text-white">
                              Require uppercase letters in passwords
                            </label>
                          </div>
                        </div>
                        
                        <div className="relative flex gap-x-3">
                          <div className="flex h-6 items-center">
                            <input
                              id="password-require-numbers"
                              name="password-require-numbers"
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-primary-600 dark:text-primary-500 focus:ring-primary-600 dark:focus:ring-primary-500"
                              checked={passwordRequireNumbers}
                              onChange={(e) => setPasswordRequireNumbers(e.target.checked)}
                            />
                          </div>
                          <div className="text-sm leading-6">
                            <label htmlFor="password-require-numbers" className="font-medium text-gray-900 dark:text-white">
                              Require numbers in passwords
                            </label>
                          </div>
                        </div>
                        
                        <div className="relative flex gap-x-3">
                          <div className="flex h-6 items-center">
                            <input
                              id="password-require-symbols"
                              name="password-require-symbols"
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-primary-600 dark:text-primary-500 focus:ring-primary-600 dark:focus:ring-primary-500"
                              checked={passwordRequireSymbols}
                              onChange={(e) => setPasswordRequireSymbols(e.target.checked)}
                            />
                          </div>
                          <div className="text-sm leading-6">
                            <label htmlFor="password-require-symbols" className="font-medium text-gray-900 dark:text-white">
                              Require special characters in passwords
                            </label>
                          </div>
                        </div>
                        
                        <div className="relative flex gap-x-3">
                          <div className="flex h-6 items-center">
                            <input
                              id="mfa-enabled"
                              name="mfa-enabled"
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-primary-600 dark:text-primary-500 focus:ring-primary-600 dark:focus:ring-primary-500"
                              checked={mfaEnabled}
                              onChange={(e) => setMfaEnabled(e.target.checked)}
                            />
                          </div>
                          <div className="text-sm leading-6">
                            <label htmlFor="mfa-enabled" className="font-medium text-gray-900 dark:text-white">
                              Enable Multi-Factor Authentication (MFA)
                            </label>
                            <p className="text-gray-500 dark:text-gray-400">Allow users to secure their accounts with MFA.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Email Settings */}
                <div className="border-b border-gray-900/10 dark:border-gray-700 pb-12">
                  <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-white">Email Settings</h2>
                  <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
                    Configure email delivery settings.
                  </p>

                  <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label htmlFor="smtp-host" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
                        SMTP Host
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="smtp-host"
                          id="smtp-host"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 dark:focus:ring-primary-500 sm:text-sm sm:leading-6 dark:bg-gray-700"
                          value={smtpHost}
                          onChange={(e) => setSmtpHost(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="smtp-port" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
                        SMTP Port
                      </label>
                      <div className="mt-2">
                        <input
                          type="number"
                          name="smtp-port"
                          id="smtp-port"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 dark:focus:ring-primary-500 sm:text-sm sm:leading-6 dark:bg-gray-700"
                          value={smtpPort}
                          onChange={(e) => setSmtpPort(parseInt(e.target.value))}
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="smtp-user" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
                        SMTP Username
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="smtp-user"
                          id="smtp-user"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 dark:focus:ring-primary-500 sm:text-sm sm:leading-6 dark:bg-gray-700"
                          value={smtpUser}
                          onChange={(e) => setSmtpUser(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="smtp-password" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
                        SMTP Password
                      </label>
                      <div className="mt-2">
                        <input
                          type="password"
                          name="smtp-password"
                          id="smtp-password"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 dark:focus:ring-primary-500 sm:text-sm sm:leading-6 dark:bg-gray-700"
                          value={smtpPassword}
                          onChange={(e) => setSmtpPassword(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="email-from-name" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
                        From Name
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="email-from-name"
                          id="email-from-name"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 dark:focus:ring-primary-500 sm:text-sm sm:leading-6 dark:bg-gray-700"
                          value={emailFromName}
                          onChange={(e) => setEmailFromName(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="email-from-address" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
                        From Email Address
                      </label>
                      <div className="mt-2">
                        <input
                          type="email"
                          name="email-from-address"
                          id="email-from-address"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 dark:focus:ring-primary-500 sm:text-sm sm:leading-6 dark:bg-gray-700"
                          value={emailFromAddress}
                          onChange={(e) => setEmailFromAddress(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-6">
                      <div className="relative flex gap-x-3">
                        <div className="flex h-6 items-center">
                          <input
                            id="smtp-secure"
                            name="smtp-secure"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-primary-600 dark:text-primary-500 focus:ring-primary-600 dark:focus:ring-primary-500"
                            checked={smtpSecure}
                            onChange={(e) => setSmtpSecure(e.target.checked)}
                          />
                        </div>
                        <div className="text-sm leading-6">
                          <label htmlFor="smtp-secure" className="font-medium text-gray-900 dark:text-white">
                            Use Secure Connection (TLS/SSL)
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subscription Settings */}
                <div className="border-b border-gray-900/10 dark:border-gray-700 pb-12">
                  <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-white">Subscription Settings</h2>
                  <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
                    Configure subscription and billing options.
                  </p>

                  <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label htmlFor="trial-days" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
                        Trial Period (days)
                      </label>
                      <div className="mt-2">
                        <input
                          type="number"
                          name="trial-days"
                          id="trial-days"
                          min="0"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 dark:focus:ring-primary-500 sm:text-sm sm:leading-6 dark:bg-gray-700"
                          value={trialDays}
                          onChange={(e) => setTrialDays(parseInt(e.target.value))}
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-6">
                      <div className="space-y-6">
                        <div className="relative flex gap-x-3">
                          <div className="flex h-6 items-center">
                            <input
                              id="allow-free-tier"
                              name="allow-free-tier"
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-primary-600 dark:text-primary-500 focus:ring-primary-600 dark:focus:ring-primary-500"
                              checked={allowFreeTier}
                              onChange={(e) => setAllowFreeTier(e.target.checked)}
                            />
                          </div>
                          <div className="text-sm leading-6">
                            <label htmlFor="allow-free-tier" className="font-medium text-gray-900 dark:text-white">
                              Allow Free Tier
                            </label>
                            <p className="text-gray-500 dark:text-gray-400">Enable free tier subscriptions with limited features.</p>
                          </div>
                        </div>
                        
                        <div className="relative flex gap-x-3">
                          <div className="flex h-6 items-center">
                            <input
                              id="auto-renew-subscriptions"
                              name="auto-renew-subscriptions"
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-primary-600 dark:text-primary-500 focus:ring-primary-600 dark:focus:ring-primary-500"
                              checked={autoRenewSubscriptions}
                              onChange={(e) => setAutoRenewSubscriptions(e.target.checked)}
                            />
                          </div>
                          <div className="text-sm leading-6">
                            <label htmlFor="auto-renew-subscriptions" className="font-medium text-gray-900 dark:text-white">
                              Auto-renew Subscriptions
                            </label>
                          </div>
                        </div>
                        
                        <div className="relative flex gap-x-3">
                          <div className="flex h-6 items-center">
                            <input
                              id="send-renewal-reminders"
                              name="send-renewal-reminders"
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-primary-600 dark:text-primary-500 focus:ring-primary-600 dark:focus:ring-primary-500"
                              checked={sendRenewalReminders}
                              onChange={(e) => setSendRenewalReminders(e.target.checked)}
                            />
                          </div>
                          <div className="text-sm leading-6">
                            <label htmlFor="send-renewal-reminders" className="font-medium text-gray-900 dark:text-white">
                              Send Renewal Reminders
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* API Settings */}
                <div className="border-b border-gray-900/10 dark:border-gray-700 pb-12">
                  <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-white">API Settings</h2>
                  <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
                    Configure API access and rate limits.
                  </p>

                  <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label htmlFor="api-rate-limit" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
                        API Rate Limit (requests per minute)
                      </label>
                      <div className="mt-2">
                        <input
                          type="number"
                          name="api-rate-limit"
                          id="api-rate-limit"
                          min="10"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 dark:focus:ring-primary-500 sm:text-sm sm:leading-6 dark:bg-gray-700"
                          value={apiRateLimit}
                          onChange={(e) => setApiRateLimit(parseInt(e.target.value))}
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="api-token-expiry" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
                        API Token Expiry (days)
                      </label>
                      <div className="mt-2">
                        <input
                          type="number"
                          name="api-token-expiry"
                          id="api-token-expiry"
                          min="1"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 dark:focus:ring-primary-500 sm:text-sm sm:leading-6 dark:bg-gray-700"
                          value={apiTokenExpiry}
                          onChange={(e) => setApiTokenExpiry(parseInt(e.target.value))}
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-6">
                      <div className="relative flex gap-x-3">
                        <div className="flex h-6 items-center">
                          <input
                            id="enable-public-api"
                            name="enable-public-api"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-primary-600 dark:text-primary-500 focus:ring-primary-600 dark:focus:ring-primary-500"
                            checked={enablePublicApi}
                            onChange={(e) => setEnablePublicApi(e.target.checked)}
                          />
                        </div>
                        <div className="text-sm leading-6">
                          <label htmlFor="enable-public-api" className="font-medium text-gray-900 dark:text-white">
                            Enable Public API
                          </label>
                          <p className="text-gray-500 dark:text-gray-400">Allow external applications to access the API.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-x-6">
                <button
                  type="button"
                  className="text-sm font-semibold leading-6 text-gray-900 dark:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsAdminPage;
