# Authentication Troubleshooting Guide

This document provides guidance on troubleshooting and fixing authentication issues in the SaaS template application.

## Latest Fixes (Updated)

The following issues have been fixed in the latest update:

1. **Client Dockerfile**: Fixed issues with environment variables and build process
2. **CORS Configuration**: Enhanced CORS settings with better logging and support for multiple origins
3. **Cookie Settings**: Improved cookie configuration for better browser compatibility
4. **Error Handling**: Added comprehensive logging throughout the authentication flow
5. **API URL Handling**: Ensured consistent API URL usage between client and server

## How to Apply the Fixes

Run the provided script to rebuild and restart the application with the fixed configuration:

- **Windows**: Run `restart-auth.bat`
- **Linux/Mac**: Run `./restart-auth.sh`

These scripts will:
1. Stop existing containers
2. Clean up any dangling volumes
3. Rebuild all containers with the updated configuration
4. Start the application
5. Show container status and logs

## Common Authentication Issues

### 1. CORS Errors

If you see CORS errors in the browser console:

```
Access to XMLHttpRequest at 'http://server:5000/api/v1/auth/me' from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Solution**:
- The updated CORS configuration now supports multiple origins and includes better logging
- Check the server logs to see if your origin is being blocked
- If needed, add additional origins to the `allowedOrigins` array in `server/server.js`

### 2. Cookie Issues

If cookies aren't being sent or received properly:

**Solution**:
- The updated cookie configuration uses `sameSite: 'lax'` for better compatibility
- Cookie path is set to '/' to ensure availability across the application
- Added logging for cookie operations to help diagnose issues
- Check browser developer tools to verify cookies are being set correctly

### 3. JWT Token Problems

If JWT validation is failing:

**Solution**:
- Added detailed logging in the authentication middleware
- Check server logs for JWT verification errors
- Ensure the `JWT_SECRET` environment variable is correctly set
- The updated code includes better error handling for token validation

### 4. Client-Server Communication

If the client can't communicate with the server:

**Solution**:
- Updated the client to use a consistent API URL
- Added logging to show the actual API URL being used
- The client now builds with the correct environment variables
- Check the browser console for API URL and connection information

## Debugging Steps

1. **Check Browser Console**: Look for API URL, authentication status, and any errors
2. **Examine Server Logs**: The updated code includes detailed logging for authentication flows
3. **Inspect Network Requests**: Use browser developer tools to check request/response details
4. **Check Cookies**: Verify that the JWT cookie is being set and sent correctly
5. **Verify Environment Variables**: Check that all required environment variables are set

## Testing Authentication

To test if authentication is working:

1. Start the application with the restart script
2. Navigate to the login page
3. Log in with valid credentials
4. Check browser console for successful authentication messages
5. Verify that protected routes are accessible

If issues persist, the enhanced logging should provide more detailed information about what's going wrong.
