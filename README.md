# SaaS Template

A full-stack SaaS (Software as a Service) template with multi-tenancy support, subscription management, and admin dashboard.

## Features

- **Authentication**: User registration, login, password reset
- **Multi-tenancy**: Support for multiple organizations/tenants
- **Subscription Management**: Free and paid subscription tiers
- **Admin Dashboard**: Comprehensive admin interface
- **Dark Mode Support**: Toggle between light and dark themes
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: React, TailwindCSS
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB (v4+)
- npm or yarn

### Installation

1. Clone the repository (if you haven't already)

2. Start MongoDB
   ```bash
   # Start MongoDB with your data directory
   mongod --dbpath /path/to/data/directory
   ```

3. Set up the server
   ```bash
   # Navigate to the server directory
   cd saas-template/server

   # Install dependencies
   npm install

   # Seed the database with admin and client users
   npm run seed
   ```

4. Set up the client
   ```bash
   # Navigate to the client directory
   cd ../client

   # Install dependencies
   npm install
   ```

### Running the Application

You can run the server and client separately:

```bash
# Start the server (from the server directory)
cd saas-template/server
npm run dev

# Start the client (from the client directory)
cd saas-template/client
npm start
```

The client will be available at http://localhost:3000 and the server at http://localhost:5000.

## User Accounts

The seed script creates two user accounts:

### Admin User
- **Email**: admin@example.com
- **Password**: change_this_password_immediately
- **Role**: admin
- **Access**: Can access both regular user dashboard and admin dashboard

### Client User
- **Email**: client@example.com
- **Password**: password123
- **Role**: user
- **Subscription**: Professional plan
- **Access**: Can access regular user dashboard only

## Accessing the Admin Dashboard

1. Log in with the admin credentials
2. You'll see an "Administration" section in the sidebar with an "Admin Dashboard" link
3. Click on the "Admin Dashboard" link to access the admin dashboard
4. Alternatively, you can navigate directly to http://localhost:3000/admin

The admin dashboard provides access to:
- User management
- Tenant management
- Subscription management
- System settings

Note: Only users with the 'admin' or 'super-admin' role will see the Administration section in the sidebar.

## Accessing the User Dashboard

1. Log in with either the admin or client credentials
2. Navigate to http://localhost:3000/dashboard or click on the Dashboard link in the navigation

The user dashboard provides access to:
- User profile
- Account settings
- Subscription management
- Billing information

## Project Structure

```
saas-template/
├── client/                 # React frontend
│   ├── public/             # Static files
│   └── src/                # Source code
│       ├── context/        # React context providers
│       ├── layouts/        # Page layouts
│       └── pages/          # React components for pages
│           ├── admin/      # Admin pages
│           ├── auth/       # Authentication pages
│           ├── dashboard/  # User dashboard pages
│           ├── error/      # Error pages
│           └── public/     # Public pages
├── server/                 # Node.js backend
│   ├── config/             # Configuration files
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Express middleware
│   ├── models/             # Mongoose models
│   └── routes/             # API routes
└── README.md               # This file
```

## Customization

### Environment Variables

The server uses environment variables for configuration. Copy the `.env.example` file to `.env` and update the values as needed.

### Styling

The client uses TailwindCSS for styling. You can customize the theme in the `tailwind.config.js` file.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
