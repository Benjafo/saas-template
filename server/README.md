# SaaS Template - Backend Server

This is the backend server for the SaaS Template application. It provides a complete API for a SaaS application with features like authentication, subscription management, multi-tenancy, and more.

## Features

- **Authentication**: Complete JWT-based authentication system with signup, login, password reset, etc.
- **User Management**: User profiles, preferences, and role-based access control
- **Subscription Management**: Subscription plans, billing, and payment processing with Stripe
- **Multi-tenancy**: Support for multiple tenants with isolated data and configuration
- **Admin Dashboard**: Comprehensive admin features for managing users, subscriptions, and system settings
- **Security**: Secure API with rate limiting, CORS, and other security best practices

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Stripe for payment processing

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Stripe account (for payment processing)

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/saas-template.git
   cd saas-template/server
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Set up environment variables
   ```
   cp config/.env.example config/.env
   ```
   Edit the `.env` file and add your configuration values.

4. Start the development server
   ```
   npm run dev
   ```

The server will start on the port specified in your `.env` file (default: 5000).

## API Documentation

### Authentication Endpoints

- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login a user
- `POST /api/v1/auth/forgot-password` - Request password reset
- `PATCH /api/v1/auth/reset-password/:token` - Reset password with token
- `PATCH /api/v1/auth/update-password` - Update password (authenticated)
- `GET /api/v1/auth/me` - Get current user profile
- `PATCH /api/v1/auth/update-me` - Update current user profile
- `DELETE /api/v1/auth/delete-me` - Delete current user account

### User Endpoints

- `GET /api/v1/users/profile` - Get user profile
- `PATCH /api/v1/users/profile` - Update user profile
- `PATCH /api/v1/users/preferences` - Update user preferences
- `GET /api/v1/users/subscription` - Get user subscription
- `POST /api/v1/users/subscription/upgrade` - Upgrade subscription
- `POST /api/v1/users/subscription/downgrade` - Downgrade subscription
- `POST /api/v1/users/subscription/cancel` - Cancel subscription
- `GET /api/v1/users/billing` - Get billing information
- `PATCH /api/v1/users/billing` - Update billing information
- `GET /api/v1/users/invoices` - Get user invoices

### Subscription Endpoints

- `GET /api/v1/subscriptions/plans` - Get available subscription plans
- `GET /api/v1/subscriptions/current` - Get current subscription
- `POST /api/v1/subscriptions/create-checkout-session` - Create Stripe checkout session
- `POST /api/v1/subscriptions/create-portal-session` - Create Stripe customer portal session
- `POST /api/v1/subscriptions/webhook` - Handle Stripe webhook events

### Admin Endpoints

- `GET /api/v1/admin/stats` - Get dashboard statistics
- `GET /api/v1/admin/revenue` - Get revenue statistics
- `GET /api/v1/admin/users/growth` - Get user growth statistics
- `GET /api/v1/admin/subscriptions/distribution` - Get subscription distribution
- `GET /api/v1/admin/users` - Get all users
- `GET /api/v1/admin/users/:id` - Get a specific user
- `PATCH /api/v1/admin/users/:id` - Update a user
- `DELETE /api/v1/admin/users/:id` - Delete a user
- `POST /api/v1/admin/users/:id/impersonate` - Impersonate a user
- `GET /api/v1/admin/tenants` - Get all tenants
- `GET /api/v1/admin/tenants/:id` - Get a specific tenant
- `PATCH /api/v1/admin/tenants/:id` - Update a tenant
- `DELETE /api/v1/admin/tenants/:id` - Delete a tenant
- `POST /api/v1/admin/tenants/:id/status` - Update tenant status
- `GET /api/v1/admin/settings` - Get system settings
- `PATCH /api/v1/admin/settings` - Update system settings

## Deployment

For production deployment:

1. Set the `NODE_ENV` environment variable to `production`
2. Ensure all production environment variables are set
3. Build and start the server:
   ```
   npm start
   ```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
