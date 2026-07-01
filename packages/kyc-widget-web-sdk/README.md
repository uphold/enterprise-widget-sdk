# kyc-widget-web-sdk

[![npm version](https://img.shields.io/npm/v/@uphold/enterprise-kyc-widget-web-sdk.svg?style=flat-square)](https://www.npmjs.com/package/@uphold/enterprise-kyc-widget-web-sdk)

A Web SDK for the Enterprise KYC Widget.

## Installation

To install the package, run:

```bash
npm install @uphold/enterprise-kyc-widget-web-sdk
```

## Usage

You must obtain a KYC widget session before you can use the widget. Use the [`Create KYC Widget Session`](https://developer.uphold.com/rest-apis/widgets-api/kyc/create-session) endpoint from the **Enterprise REST API**, providing the desired widget flow and the user context for the operation.

> [!CAUTION]
> Always make the `Create KYC Widget Session` request from your backend, not the browser. This ensures sensitive information, such as client credentials, is not exposed to the client-side.

With the KYC session in hand, you can initialize the widget and mount it to a DOM element:

```javascript
import {
  KycWidget,
  type KycWidgetCompleteEvent,
  type KycWidgetCancelEvent,
  type KycWidgetErrorEvent,
  type KycWidgetReadyEvent
} from '@uphold/enterprise-kyc-widget-web-sdk';

// This is the KYC session object you received from the `Create KYC Widget Session`.
const kycSession = {};

// Initialize the widget with the KYC session.
const widget = new KycWidget(kycSession);

// Register event handlers.
widget.on('ready', (_: KycWidgetReadyEvent) => {
  // 'ready' event is raised when the widget is fully initialized and ready for interaction.
  console.log(`'ready' event raised`);
});

widget.on('complete', (e: KycWidgetCompleteEvent) => {
  // 'complete' event is raised when the user completes the flow.
  console.log(`'complete' event raised. detail: `, e.detail);
  widget.unmount();
});

widget.on('cancel', (_: KycWidgetCancelEvent) => {
  // 'cancel' event is raised when the user cancels the flow.
  console.log(`'cancel' event raised`);
  widget.unmount();
});

widget.on('error', (e: KycWidgetErrorEvent) => {
  // 'error' event is raised when the widget encounters an unrecoverable error.
  console.log(`'error' event raised. error: `, e.detail.error);
  widget.unmount();
});

// Mount the widget in an iframe on a DOM element.
widget.mountIframe(document.getElementById('kyc-widget-root'));
```

### Selecting KYC processes

The KYC processes available on the widget (e.g. `identity`, `proof-of-address`) are configured when you create the session, via the `Create KYC Widget Session` request from your backend.

### Theming

You can optionally define a theme to customize the widget's appearance using the `theme` option:

```javascript
const widget = new KycWidget(kycSession, {
  theme: {
    appearance: 'light',
    background: {
      dark: '#111113',
      light: '#edf2ed'
    },
    components: {
      button: { borderRadius: '999px' },
      card: { borderRadius: '10px' },
      input: { borderRadius: '8px' }
    },
    fontFamily: 'Helvetica',
    foreground: {
      dark: '#FFFFFF',
      light: '#000000'
    },
    primary: {
      dark: '#16cb3e',
      light: '#0c2801'
    },
    primaryForeground: {
      dark: '#111111',
      light: '#FFFFFF'
    },
    emphasisForeground: {
      dark: '#FFFFFF',
      light: '#000000'
    }
  }
});
```

### Layout

You can optionally control how the widget is laid out on wider viewports using the `layout` option:

- `'boxed'` (default): on wider viewports (≥768px wide and ≥600px tall — i.e. tablet and up), centers the widget and frames its content as a fixed-size card. On smaller viewports, including landscape phones, it renders full-bleed.
- `'fluid'`: renders the widget full-bleed with no frame or centering, so your own container (e.g. a modal) acts as the frame.

```javascript
const widget = new KycWidget(kycSession, { layout: 'fluid' });
```

### Debugging

The `debug` option enables additional logging to the console, which can help during development. To enable debugging, set the `debug` option to `true` when initializing the widget:

```javascript
const widget = new KycWidget(kycSession, { debug: true });
```

## Contributing

### Installing the project

Install the dependencies:

```bash
npm install
```

### Running the project

Check the documentation for the [`widget-test-app`](../../projects/widget-test-app/README.md) project to see how to run the KYC web SDK test application.

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

### Generating a new release

Releases are performed manually via a specific `Release` GitHub workflow. After merging the changes to the `master` branch, trigger the workflow selecting that branch and the appropriate version bump to apply to the new version.

> [!IMPORTANT]
> If there is a change to the core package that affects this package, make sure to update the dependency version in the `package.json` file before creating the release as it will not be automatically updated. Check the core package README for more details.
