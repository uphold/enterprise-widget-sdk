# widget-test-app

A web application for testing Enterprise Widget SDKs.

## Tech stack

Here's the main stack used in this project:

- [Typescript](https://www.typescriptlang.org/) for authoring our code.
- [React Router](https://reactrouter.com/) as the React framework.
- [Vite](https://vite.dev//) as the build tool.

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Running the Payment Widget Web SDK Test Page

To test the Payment Widget Web SDK in the browser, follow these steps:

#### **Set up environment variables**

Copy the `.env.sample` file to `.env` and set the values for the following variables:

- **VITE_CLIENT_ID**: The client ID used to obtain a token from the Enterprise API.

- **VITE_CLIENT_SECRET**: The corresponding secret for the client ID.

- **VITE_IMPERSONATE_USER_ID**: A user ID that will be impersonated in the Enterprise API calls.

- **VITE_PAYMENT_SESSION_URL_OVERRIDE**: This will override the response from the "create payment widget session" request to allow running the payment widget locally. (Example: `http://localhost:8788`).

- **VITE_ENTERPRISE_CORE_API_BASE_URL**: The base URL for all `Enterprise Core API` calls. This will be used in vite's proxy server configuration to proxy requests to the specified `PROXY_TARGET_ENTERPRISE_CORE_API` url (check below) to avoid CORS errors.

- **VITE_ENTERPRISE_WIDGETS_API_BASE_URL**: The same as `VITE_ENTERPRISE_CORE_API_BASE_URL` but for the `Enterprise Widgets API`. Accordingly, there is a `PROXY_TARGET_ENTERPRISE_WIDGETS_API` (check below) to avoid CORS errors.

- **PROXY_TARGET_ENTERPRISE_CORE_API**: The URL that Vite's dev server should use to forward requests matching `VITE_ENTERPRISE_CORE_API_BASE_URL`.

- **PROXY_TARGET_ENTERPRISE_WIDGETS_API**=The URL that Vite's dev server should use to forward requests matching `VITE_ENTERPRISE_WIDGETS_API_BASE_URL`.

> [!NOTE]  
> Except for `VITE_PAYMENT_SESSION_URL_OVERRIDE`, all other values are required.

#### Start the payment widget project

Start the Payment Widget project and ensure it is listening at the URL specified by the `VITE_PAYMENT_SESSION_URL_OVERRIDE` environment variable in step 1.

#### Start the Enterprise Core API

Start the `Enterprise Core API` and ensure it is listening on the value specified for the `PROXY_TARGET_ENTERPRISE_CORE_API` environment variable in step 1.

If you want to use the version installed in the `development-enterprise` environment, you can do the following:

```sh
kubectl port-forward deployment/core-rest-server 4001:8080 -n enterprise-rest-api --context development-enterprise
```

#### Start the Enterprise Widgets API

Start the `Enterprise Widgets API` and ensure it is listening on the value specified for the `PROXY_TARGET_ENTERPRISE_WIDGETS_API` environment variable in step 1.

If you want to use the version installed in the `development-enterprise` environment, you can do the following:

```sh
kubectl port-forward deployment/widgets-rest-server 4002:8080 -n enterprise-rest-api --context development-enterprise
```

#### Start the Widget Test App

Start the widget test app by running the following command:

```sh
npm run dev
```

It will print the URL where the app is running, usually `http://localhost:5173`. Open this URL in your browser.

##### Select the "Payment Widget" option

Click the `"Payment Widget"` button to navigate to the `"Payment Widget SDK Test"` page. This will:

Create a token with the Enterprise API using the client credentials provided in the `.env` file;
Create a payment widget session and override the URL in the response with the value of `VITE_PAYMENT_SESSION_URL_OVERRIDE`, if specified;
Instantiate the widget with the URL from the payment widget session.

Enjoy testing!

### Development

#### Lint

To lint the project, run:

```sh
npm run lint
```

#### Test

To test the project, run:

```sh
npm test
```

#### Typecheck

To perform type checking on the project, run:

```sh
npm run typecheck
```
