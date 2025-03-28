# payment-widget-web-sdk

A Web SDK for the Enterprise Payment Widget.

## Installation

To install the package, run:

```bash
npm install @uphold/payment-widget-web-sdk
```

## Usage

You must obtain a payment widget session before you can use the widget. Use the [`Create Payment Widget Session`](https://developer.uphold.com/rest-apis/widgets-api/payment/create-session) endpoint from the **Enterprise REST API**, providing the desired widget flow and the user context for the operation.

> ⚠️ **Important**:  
> Always make the `Create Payment Widget Session` request from your backend, not the browser. This ensures sensitive information, such as client credentials, is not exposed to the client-side, reducing the risk of security vulnerabilities.

With the payment session in hand, you can initialize the widget and mount it to a DOM element:

```javascript
import {
  PaymentWidget,
  type PaymentWidgetCompleteEvent,
  type WidgetCancelEvent,
  type WidgetErrorEvent
} from '@uphold/enterprise-payment-widget-web-sdk';

// This is the payment session object you received from the `Create Payment Widget Session`.
const paymentSession = {};

// Initialize the widget with the payment session.
const widget = new PaymentWidget(paymentSession);

const completeHandler = (e: PaymentWidgetCompleteEvent) => {
  console.log(`'complete' event raised. Account id: `, e.detail.externalAccountId);

  // Unmount the widget after the flow is complete.
  widget.unmount();
};

const cancelHandler = (_: WidgetCancelEvent) => {
  console.log(`'cancel' event raised`);

  // Unmount the widget after user cancellation.
  widget.unmount();
};

// Register event handlers.
const errorHandler = (e: WidgetErrorEvent) => {
  console.log(`'error' event raised. error: `, e.detail.error);

  // Unmount the widget after handling the error.
  widget.unmount();
};


// 'complete' event is raised when the user completes the flow.
widget.on('complete', completeHandler);
// 'cancel' event is raised when the user cancels the flow.
widget.on('cancel', cancelHandler);
// 'error' event is raised when the widget encounters an unrecoverable error.
widget.on('error', errorHandler);

// Mount the widget in an iframe on a DOM element.
widget.mountIframe(document.getElementById('payment-widget-root'));
```

### Debugging

The `debug` option enables additional logging to the console, which can help during development. To enable debugging, set the `debug` option to `true` when initializing the widget:

```javascript
const widget = new PaymentWidget(paymentSession, { debug: true });
```

## Contributing

### Installing the project

Install the dependencies:

```bash
npm install
```

### Running the project

Check the documentation for the [`widget-test-app`](../../projects/widget-test-app/README.md) project to see how to run the payment gateway web SDK test application.

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

To type check the project, run:

```sh
npm run typecheck
```

### Building for production

To create a production build, run:

```sh
npm run build
```
