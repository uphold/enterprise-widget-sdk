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

#### **Set up configuration**

Copy the `config.sample.ts` file to `config.ts` and set the required values for the flow you want to test. Check the comments of that file for more information.

> [!NOTE]
> Except for `paymentWidgetSession.urlOverride`, all other values are required.

#### Setup authorize flow (optional)

If you want to test the `authorize` flow, you need to configure the create quote request body to be used to create the quote to authorize. To do so, inside the `config.ts` file set the values you want for the body in `flows.authorize.createQuoteBody` property. You can just paste the body from the postman collection to make it easier.

#### Start the payment widget project (optional)

If you want to run the payment widget project locally, start it and ensure it is listening at the URL specified by the `paymentWidgetSession.urlOverride` property in `config.ts` file.

#### Start the Widget Test App

Start the widget test app by running the following command:

```sh
npm run dev
```

It will print the URL where the app is running, usually `http://localhost:8789`. Open this URL in your browser.

##### Select the "Payment Widget" option and the desired flow

Click the `"Payment Widget"` button to navigate to the `"Payment Widget SDK Test"` page. That page will present the available flows you can test. Select the flow you desire by clicking on it and enjoy testing!

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
