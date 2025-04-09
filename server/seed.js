const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/user.model');
const Tenant = require('./models/tenant.model');
const Activity = require('./models/activity.model');
const Invoice = require('./models/invoice.model');
const Config = require('./models/config.model');
const connectDB = require('./config/database');
const { faker } = require('@faker-js/faker');
const readline = require('readline');

// Load environment variables
dotenv.config({ path: './config/.env' });

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Helper function to generate a random date between two dates
const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Helper function to generate a random subscription plan
const getRandomPlan = () => {
  const plans = ['free', 'starter', 'professional', 'enterprise'];
  const weights = [0.4, 0.3, 0.2, 0.1]; // 40% free, 30% starter, 20% professional, 10% enterprise
  
  const random = Math.random();
  let sum = 0;
  
  for (let i = 0; i < plans.length; i++) {
    sum += weights[i];
    if (random < sum) return plans[i];
  }
  
  return plans[0]; // Default to free if something goes wrong
};

// Helper function to generate a random subscription status
const getRandomStatus = () => {
  const statuses = ['active', 'trialing', 'past_due', 'canceled'];
  const weights = [0.7, 0.1, 0.1, 0.1]; // 70% active, 10% each for others
  
  const random = Math.random();
  let sum = 0;
  
  for (let i = 0; i < statuses.length; i++) {
    sum += weights[i];
    if (random < sum) return statuses[i];
  }
  
  return statuses[0]; // Default to active if something goes wrong
};

// Helper function to generate a slug from a name
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

// Helper function to generate tenant features based on plan
const getTenantFeatures = (plan) => {
  switch (plan) {
    case 'free':
      return {
        storage: 100, // 100 MB
        customDomain: false,
        apiAccess: false,
        whiteLabeling: false,
        prioritySupport: false
      };
    case 'starter':
      return {
        storage: 1000, // 1 GB
        customDomain: false,
        apiAccess: true,
        whiteLabeling: false,
        prioritySupport: false
      };
    case 'professional':
      return {
        storage: 5000, // 5 GB
        customDomain: true,
        apiAccess: true,
        whiteLabeling: true,
        prioritySupport: false
      };
    case 'enterprise':
      return {
        storage: 10000, // 10 GB
        customDomain: true,
        apiAccess: true,
        whiteLabeling: true,
        prioritySupport: true
      };
    default:
      return {
        storage: 100,
        customDomain: false,
        apiAccess: false,
        whiteLabeling: false,
        prioritySupport: false
      };
  }
};

// Helper function to generate user data
const generateUserData = (email, password, name, role = 'user', tenantId = null, plan = null) => {
  const subscriptionPlan = plan || getRandomPlan();
  const subscriptionStatus = getRandomStatus();
  
  // Generate dates
  const now = new Date();
  const startDate = randomDate(new Date(now.getFullYear() - 1, 0, 1), now);
  
  // For active and trialing, end date is in the future
  // For past_due and canceled, end date might be in the past
  let endDate;
  if (subscriptionStatus === 'active' || subscriptionStatus === 'trialing') {
    endDate = new Date(startDate.getTime() + 365 * 24 * 60 * 60 * 1000); // 1 year from start date
  } else {
    endDate = randomDate(startDate, new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000));
  }
  
  // For trialing, set a trial end date
  const trialEndsAt = subscriptionStatus === 'trialing' 
    ? new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000) // 14 days from now
    : undefined;
  
  return {
    name,
    email,
    password,
    passwordConfirm: password,
    role,
    tenantId,
    subscription: {
      plan: subscriptionPlan,
      status: subscriptionStatus,
      startDate,
      endDate,
      trialEndsAt
    },
    preferences: {
      theme: Math.random() > 0.7 ? 'dark' : 'light', // 30% dark mode users
      notifications: {
        email: {
          marketing: Math.random() > 0.3, // 70% opt-in for marketing
          updates: Math.random() > 0.2, // 80% opt-in for updates
          security: true // Everyone gets security notifications
        }
      }
    }
  };
};

// Helper function to generate tenant data
const generateTenantData = (name, ownerId, plan = null) => {
  const subscriptionPlan = plan || getRandomPlan();
  const subscriptionStatus = getRandomStatus();
  
  // Generate dates
  const now = new Date();
  const startDate = randomDate(new Date(now.getFullYear() - 1, 0, 1), now);
  
  // For active and trialing, end date is in the future
  // For past_due and canceled, end date might be in the past
  let endDate;
  if (subscriptionStatus === 'active' || subscriptionStatus === 'trialing') {
    endDate = new Date(startDate.getTime() + 365 * 24 * 60 * 60 * 1000); // 1 year from start date
  } else {
    endDate = randomDate(startDate, new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000));
  }
  
  // For trialing, set a trial end date
  const trialEndsAt = subscriptionStatus === 'trialing' 
    ? new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000) // 14 days from now
    : undefined;
  
  const slug = generateSlug(name);
  
  return {
    name,
    slug,
    domain: Math.random() > 0.7 ? `${slug}.example.com` : undefined, // Use undefined instead of null to fix seeding error
    owner: ownerId,
    active: Math.random() > 0.1, // 90% active
    subscription: {
      plan: subscriptionPlan,
      status: subscriptionStatus,
      startDate,
      endDate,
      trialEndsAt,
      seats: Math.floor(Math.random() * 10) + 1, // 1-10 seats
      features: getTenantFeatures(subscriptionPlan)
    },
    billing: {
      stripeCustomerId: `cus_${faker.string.alphanumeric(14)}`,
      stripeSubscriptionId: subscriptionStatus !== 'free' ? `sub_${faker.string.alphanumeric(14)}` : null,
      billingEmail: faker.internet.email(),
      billingAddress: {
        line1: faker.location.streetAddress(),
        line2: Math.random() > 0.7 ? faker.location.secondaryAddress() : '',
        city: faker.location.city(),
        state: faker.location.state(),
        postalCode: faker.location.zipCode(),
        country: 'US'
      }
    },
    branding: {
      logo: Math.random() > 0.5 ? `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random` : null,
      primaryColor: faker.internet.color(),
      secondaryColor: faker.internet.color()
    },
    settings: {
      timezone: faker.helpers.arrayElement(['UTC', 'America/New_York', 'Europe/London', 'Asia/Tokyo']),
      dateFormat: faker.helpers.arrayElement(['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD']),
      defaultLanguage: faker.helpers.arrayElement(['en', 'es', 'fr', 'de', 'ja'])
    }
  };
};

// Helper function to generate activity data
const generateActivityData = (users, tenants) => {
  const activities = [];
  const activityTypes = [
    'created a document',
    'updated a document',
    'commented on',
    'shared',
    'uploaded',
    'downloaded',
    'deleted',
    'logged in',
    'changed settings',
    'invited a user'
  ];
  
  const documentNames = [
    'Project Proposal',
    'Marketing Plan',
    'Financial Report',
    'Product Roadmap',
    'Meeting Notes',
    'Customer Feedback',
    'Sales Presentation',
    'Technical Documentation',
    'HR Policy',
    'Strategic Plan'
  ];
  
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  // Generate 30-50 activities
  const activityCount = Math.floor(Math.random() * 20) + 30;
  
  for (let i = 0; i < activityCount; i++) {
    const user = faker.helpers.arrayElement(users);
    const activityType = faker.helpers.arrayElement(activityTypes);
    const date = randomDate(thirtyDaysAgo, now);
    
    let target = '';
    if (!activityType.includes('logged in') && !activityType.includes('settings')) {
      target = faker.helpers.arrayElement(documentNames);
    } else if (activityType.includes('invited')) {
      target = faker.person.fullName();
    }
    
    activities.push({
      user: user.name,
      userId: user._id,
      action: activityType,
      target,
      date,
      tenantId: user.tenantId
    });
  }
  
  // Sort by date (newest first)
  return activities.sort((a, b) => b.date - a.date);
};

// Helper function to generate invoice data
const generateInvoiceData = (users) => {
  const invoices = [];
  
  // Only generate invoices for users with paid plans
  const paidUsers = users.filter(user => 
    user.subscription.plan !== 'free' && 
    (user.subscription.status === 'active' || user.subscription.status === 'past_due')
  );
  
  paidUsers.forEach(user => {
    const planPrices = {
      starter: 19.99,
      professional: 49.99,
      enterprise: 99.99
    };
    
    const basePrice = planPrices[user.subscription.plan];
    
    // Generate 1-5 invoices per user
    const invoiceCount = Math.floor(Math.random() * 5) + 1;
    
    for (let i = 0; i < invoiceCount; i++) {
      const now = new Date();
      const invoiceDate = new Date(now.getTime() - i * 30 * 24 * 60 * 60 * 1000); // Monthly invoices
      
      invoices.push({
        userId: user._id,
        tenantId: user.tenantId,
        userName: user.name,
        userEmail: user.email,
        amount: basePrice,
        currency: 'usd',
        status: i === 0 ? user.subscription.status === 'past_due' ? 'unpaid' : 'paid' : 'paid',
        date: invoiceDate,
        description: `Subscription - ${user.subscription.plan.charAt(0).toUpperCase() + user.subscription.plan.slice(1)} Plan`,
        items: [
          {
            description: `${user.subscription.plan.charAt(0).toUpperCase() + user.subscription.plan.slice(1)} Plan - Monthly`,
            amount: basePrice,
            quantity: 1
          }
        ],
        subtotal: basePrice,
        tax: 0,
        total: basePrice,
        invoiceNumber: `INV-${faker.string.numeric(6)}`,
        dueDate: new Date(invoiceDate.getTime() + 15 * 24 * 60 * 60 * 1000) // Due in 15 days
      });
    }
  });
  
  // Sort by date (newest first)
  return invoices.sort((a, b) => b.date - a.date);
};

// Helper function to generate marketing content
const generateMarketingContent = () => {
  return {
    type: 'marketing_content',
    settings: {
      faqs: [
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
        {
          question: 'What payment methods do you accept?',
          answer:
            'We accept all major credit cards (Visa, Mastercard, American Express) and PayPal. For Enterprise plans, we also offer invoicing and bank transfers.',
        },
        {
          question: 'Can I cancel my subscription at any time?',
          answer:
            'Yes, you can cancel your subscription at any time from your account settings. Your plan will remain active until the end of your current billing cycle.',
        },
        {
          question: 'Is there a limit to how many projects I can create?',
          answer:
            'No, there is no limit to the number of projects you can create on any plan. The main differences between plans are the number of users, storage space, and available features.',
        },
      ],
      dashboardQuickActions: [
        {
          title: 'Create Document',
          description: 'Start a new document from scratch.',
          icon: 'DocumentTextIcon',
          action: 'create'
        },
        {
          title: 'Invite Team Member',
          description: 'Add someone to your workspace.',
          icon: 'UserGroupIcon',
          action: 'invite'
        },
        {
          title: 'Upgrade Storage',
          description: 'Get more space for your files.',
          icon: 'ServerIcon',
          action: 'upgrade'
        }
      ]
    },
    active: true,
    version: 1
  };
};

// Helper function to generate subscription plans
const generateSubscriptionPlans = () => {
  return {
    type: 'subscription_plans',
    plans: [
      {
        name: 'Free',
        id: 'free',
        description: 'Perfect for individuals and small projects.',
        price: {
          monthly: {
            amount: 0,
            currency: 'usd',
            display: '$0'
          },
          annually: {
            amount: 0,
            currency: 'usd',
            display: '$0'
          }
        },
        featuresList: [
          'Up to 5 users',
          '1 GB storage',
          'Basic analytics',
          'Email support',
          'Community access'
        ],
        features: [
          {
            name: 'users',
            description: 'Maximum number of users',
            limit: 5,
            limitType: 'count'
          },
          {
            name: 'storage',
            description: 'Storage space',
            limit: 1000, // 1 GB in MB
            limitType: 'storage'
          },
          {
            name: 'analytics',
            description: 'Basic analytics',
            enabled: true
          },
          {
            name: 'support',
            description: 'Email support',
            enabled: true
          },
          {
            name: 'community',
            description: 'Community access',
            enabled: true
          }
        ],
        active: true,
        mostPopular: false,
        limits: {
          users: 5,
          storage: 1000 // MB
        }
      },
      {
        name: 'Pro',
        id: 'pro',
        description: 'Ideal for growing businesses and teams.',
        price: {
          monthly: {
            amount: 29,
            currency: 'usd',
            display: '$29'
          },
          annually: {
            amount: 290,
            currency: 'usd',
            display: '$290'
          }
        },
        featuresList: [
          'Up to 20 users',
          '10 GB storage',
          'Advanced analytics',
          'Priority email support',
          'API access',
          'Custom integrations',
          'Team collaboration tools'
        ],
        features: [
          {
            name: 'users',
            description: 'Maximum number of users',
            limit: 20,
            limitType: 'count'
          },
          {
            name: 'storage',
            description: 'Storage space',
            limit: 10000, // 10 GB in MB
            limitType: 'storage'
          },
          {
            name: 'analytics',
            description: 'Advanced analytics',
            enabled: true
          },
          {
            name: 'support',
            description: 'Priority email support',
            enabled: true
          },
          {
            name: 'api',
            description: 'API access',
            enabled: true
          },
          {
            name: 'integrations',
            description: 'Custom integrations',
            enabled: true
          },
          {
            name: 'collaboration',
            description: 'Team collaboration tools',
            enabled: true
          }
        ],
        active: true,
        mostPopular: true,
        limits: {
          users: 20,
          storage: 10000 // MB
        }
      },
      {
        name: 'Enterprise',
        id: 'enterprise',
        description: 'For large organizations with advanced needs.',
        price: {
          monthly: {
            amount: 99,
            currency: 'usd',
            display: '$99'
          },
          annually: {
            amount: 990,
            currency: 'usd',
            display: '$990'
          }
        },
        featuresList: [
          'Unlimited users',
          '100 GB storage',
          'Enterprise analytics',
          '24/7 phone & email support',
          'Advanced security',
          'Custom branding',
          'Dedicated account manager',
          'Single sign-on (SSO)',
          'Custom contract'
        ],
        features: [
          {
            name: 'users',
            description: 'Maximum number of users',
            limit: null, // Unlimited
            limitType: 'count'
          },
          {
            name: 'storage',
            description: 'Storage space',
            limit: 100000, // 100 GB in MB
            limitType: 'storage'
          },
          {
            name: 'analytics',
            description: 'Enterprise analytics',
            enabled: true
          },
          {
            name: 'support',
            description: '24/7 phone & email support',
            enabled: true
          },
          {
            name: 'security',
            description: 'Advanced security',
            enabled: true
          },
          {
            name: 'branding',
            description: 'Custom branding',
            enabled: true
          },
          {
            name: 'accountManager',
            description: 'Dedicated account manager',
            enabled: true
          },
          {
            name: 'sso',
            description: 'Single sign-on (SSO)',
            enabled: true
          },
          {
            name: 'customContract',
            description: 'Custom contract',
            enabled: true
          }
        ],
        active: true,
        mostPopular: false,
        limits: {
          users: null, // Unlimited
          storage: 100000 // MB
        }
      }
    ],
    active: true,
    version: 1
  };
};

// Main seeding function
const seedDatabase = async (clearExisting = false) => {
  try {
    console.log('Connecting to database')
    await connectDB();
    console.log('Database connected successfully');

    if (clearExisting) {
      console.log('\n⚠️  WARNING: This will clear all existing data in the database ⚠️');
      console.log('This action cannot be undone. Make sure this is not a production database.');
      
      await new Promise(resolve => {
        rl.question('Are you sure you want to proceed? (yes/no): ', answer => {
          if (answer.toLowerCase() !== 'yes') {
            console.log('Operation canceled.');
            process.exit(0);
          }
          resolve();
        });
      });
      
      // Delete all data from all collections
      await User.deleteMany({});
      await Tenant.deleteMany({});
      await Activity.deleteMany({});
      await Invoice.deleteMany({});
      await Config.deleteMany({});
      console.log('Existing data cleared');
    }

    // Create admin user
    console.log(`\nChecking if admin user (${process.env.ADMIN_EMAIL}) already exists...`);
    let adminUser = await User.findOne({ email: process.env.ADMIN_EMAIL });
    
    if (adminUser) {
      console.log('Admin user already exists');
    } else {
      console.log('Creating admin user...');
      
      try {
        adminUser = await User.create({
          name: 'Admin User',
          email: process.env.ADMIN_EMAIL,
          password: process.env.ADMIN_PASSWORD,
          passwordConfirm: process.env.ADMIN_PASSWORD,
          role: 'admin',
          subscription: {
            plan: 'enterprise',
            status: 'active',
            startDate: new Date(),
            endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year from now
          }
        });
        
        console.log('Admin user created successfully:');
        console.log(`- Email: ${adminUser.email}`);
        console.log(`- Password: ${process.env.ADMIN_PASSWORD}`);
      } catch (error) {
        console.error('Error creating admin user:', error.message);
        if (error.errors) {
          Object.keys(error.errors).forEach(field => {
            console.error(`- ${field}: ${error.errors[field].message}`);
          });
        }
        process.exit(1);
      }
    }

    // Create super-admin user
    const superAdminEmail = 'superadmin@example.com';
    const superAdminPassword = 'superadmin123';
    
    console.log(`\nChecking if super-admin user (${superAdminEmail}) already exists...`);
    let superAdminUser = await User.findOne({ email: superAdminEmail });
    
    if (superAdminUser) {
      console.log('Super-admin user already exists');
    } else {
      console.log('Creating super-admin user...');
      
      try {
        superAdminUser = await User.create({
          name: 'Super Admin',
          email: superAdminEmail,
          password: superAdminPassword,
          passwordConfirm: superAdminPassword,
          role: 'super-admin',
          subscription: {
            plan: 'enterprise',
            status: 'active',
            startDate: new Date(),
            endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year from now
          }
        });
        
        console.log('Super-admin user created successfully:');
        console.log(`- Email: ${superAdminUser.email}`);
        console.log(`- Password: ${superAdminPassword}`);
      } catch (error) {
        console.error('Error creating super-admin user:', error.message);
        if (error.errors) {
          Object.keys(error.errors).forEach(field => {
            console.error(`- ${field}: ${error.errors[field].message}`);
          });
        }
      }
    }

    // Create tenants
    console.log('\nCreating tenant organizations...');
    const tenantCount = 5;
    const tenants = [];
    
    // Create a tenant for the admin user
    let adminTenant = await Tenant.findOne({ owner: adminUser._id });
    
    if (!adminTenant) {
      adminTenant = await Tenant.create(generateTenantData('Admin Organization', adminUser._id, 'enterprise'));
      console.log(`Created tenant: ${adminTenant.name}`);
      tenants.push(adminTenant);
      
      // Update admin user with tenant ID
      adminUser.tenantId = adminTenant._id;
      await adminUser.save({ validateBeforeSave: false });
    } else {
      console.log(`Admin tenant already exists: ${adminTenant.name}`);
      tenants.push(adminTenant);
    }
    
    // Create additional tenants
    for (let i = 0; i < tenantCount - 1; i++) {
      const tenantName = `${faker.company.name()} ${faker.company.buzzNoun()}`;
      
      // Check if tenant already exists
      const existingTenant = await Tenant.findOne({ name: tenantName });
      
      if (!existingTenant) {
        const tenant = await Tenant.create(generateTenantData(tenantName, adminUser._id));
        console.log(`Created tenant: ${tenant.name}`);
        tenants.push(tenant);
      }
    }
    
    // Create regular users
    console.log('\nCreating regular users...');
    const userCount = 50; // Increased from 10 to 50 for pagination demo
    const users = [adminUser, superAdminUser];

    // Create a client user
    const clientEmail = 'client@example.com';
    const clientPassword = 'password123';
    
    console.log(`\nChecking if client user (${clientEmail}) already exists...`);
    let clientUser = await User.findOne({ email: clientEmail });
    
    if (clientUser) {
      console.log('Client user already exists');
      users.push(clientUser);
    } else {
      console.log('Creating client user...');
      
      try {
        const randomTenant = faker.helpers.arrayElement(tenants);
        clientUser = await User.create(generateUserData(
          clientEmail,
          clientPassword,
          'Test Client',
          'user',
          randomTenant._id,
          'professional'
        ));
        
        console.log('Client user created successfully:');
        console.log(`- Email: ${clientUser.email}`);
        console.log(`- Password: ${clientPassword}`);
        console.log(`- Tenant: ${randomTenant.name}`);
        
        users.push(clientUser);
      } catch (error) {
        console.error('Error creating client user:', error.message);
        if (error.errors) {
          Object.keys(error.errors).forEach(field => {
            console.error(`- ${field}: ${error.errors[field].message}`);
          });
        }
      }
    }
    
    // Create additional users
    for (let i = 0; i < userCount - 1; i++) {
      const email = faker.internet.email().toLowerCase();
      const password = 'password123'; // Same password for all test users
      const name = faker.person.fullName();
      const randomTenant = faker.helpers.arrayElement(tenants);
      
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      
      if (!existingUser) {
        const user = await User.create(generateUserData(
          email,
          password,
          name,
          'user',
          randomTenant._id
        ));
        
        console.log(`Created user: ${user.name} (${user.email})`);
        users.push(user);
      }
    }
    
    // Generate and store subscription plans in the database
    console.log('\nGenerating subscription plans...');
    const existingPlansConfig = await Config.findOne({ type: 'subscription_plans' });
    
    if (!existingPlansConfig) {
      const plansConfig = await Config.create(generateSubscriptionPlans());
      console.log(`Created subscription plans config (${plansConfig.plans.length} plans)`);
    } else {
      console.log('Subscription plans already exist in the database');
    }
    
    // Generate and store marketing content in the database
    console.log('\nGenerating marketing content...');
    const existingMarketingConfig = await Config.findOne({ type: 'marketing_content' });
    
    if (!existingMarketingConfig) {
      const marketingConfig = await Config.create(generateMarketingContent());
      console.log('Created marketing content config');
    } else {
      console.log('Marketing content already exists in the database');
    }
    
    // Generate and store activity data
    console.log('\nGenerating activity data...');
    const activities = generateActivityData(users, tenants);
    
    // Delete existing activities if clearing data
    if (clearExisting) {
      await Activity.deleteMany({});
    }
    
    // Store activities in the database
    await Activity.insertMany(activities);
    console.log(`Generated ${activities.length} activity records and stored in database`);
    
    // Generate and store invoice data
    console.log('\nGenerating invoice data...');
    const invoices = generateInvoiceData(users);
    
    // Delete existing invoices if clearing data
    if (clearExisting) {
      await Invoice.deleteMany({});
    }
    
    // Store invoices in the database
    await Invoice.insertMany(invoices);
    console.log(`Generated ${invoices.length} invoice records and stored in database`);
    
    console.log('\nDatabase seeding completed successfully!');
    console.log('\nAdmin user credentials:');
    console.log(`- Email: ${process.env.ADMIN_EMAIL}`);
    console.log(`- Password: ${process.env.ADMIN_PASSWORD}`);
    
    console.log('\nClient user credentials:');
    console.log(`- Email: ${clientEmail}`);
    console.log(`- Password: ${clientPassword}`);
    
    console.log('\nSuper-admin user credentials:');
    console.log(`- Email: ${superAdminEmail}`);
    console.log(`- Password: ${superAdminPassword}`);
    
    rl.close();
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error.message);
    if (error.message.includes('ECONNREFUSED')) {
      console.error('\nMake sure MongoDB is running. You can start it with:');
      console.error('mongod --dbpath /path/to/data/directory\n');
      console.error('If MongoDB is running, check that the DATABASE_URI in .env is correct.');
      console.error('Current DATABASE_URI:', process.env.DATABASE_URI);
    }
    rl.close();
    process.exit(1);
  }
};

// Check for command line arguments
const args = process.argv.slice(2);
const clearExisting = args.includes('--clear') || args.includes('-c');

// Run the seeding function
seedDatabase(clearExisting);
