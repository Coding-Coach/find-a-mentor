# Authentication System

We're using Auth0 to handle authentication in our application. This document outlines the authentication flow and how to set up your environment for development.

## Registration

1. User clicks on the "Sign Up" button.
2. User is redirected to the Auth0 login page.
3. User enters their email and password.
4. Auth0 sends a verification email, which we leverage for the welcome email.
5. User clicks on the verification link in the email.
6. User is redirected to the application with a verification token. For more information about the redirection see the [docs](https://auth0.com/docs/customize/email/email-templates#configure-template-fields) - open the "Redirect the URL" section.
> **ℹ️ Info**
> Remember. The application.callback_domain variable will contain the origin of the first URL listed in the application's Allowed Callback URL list