# travel-rule-widget-web-sdk

[![npm version](https://img.shields.io/npm/v/@uphold/enterprise-travel-rule-widget-web-sdk.svg?style=flat-square)](https://www.npmjs.com/package/@uphold/enterprise-travel-rule-widget-web-sdk)

A Web SDK for the Enterprise Travel Rule Widget.

## Installation

To install the package, run:

```bash
npm install @uphold/travel-rule-widget-web-sdk
```

## Usage

You must obtain a travel rule widget session before you can use the widget. Use the [`Create Travel Rule Widget Session`](https://developer.uphold.com/rest-apis/widgets-api/travel-rule/create-session) endpoint from the **Enterprise REST API**, providing the desired widget flow and the user context for the operation.

> [!CAUTION]
> Always make the `Create Travel Rule Widget Session` request from your backend, not the browser. This ensures sensitive information, such as client credentials, is not exposed to the client-side.

With the travel rule session in hand, you can initialize the widget and mount it to a DOM element:

```javascript
import {
  TravelRuleWidget,
  type TravelRuleWidgetCompleteEvent,
  type WidgetCancelEvent,
  type WidgetErrorEvent
} from '@uphold/enterprise-travel-rule-widget-web-sdk';

// This is the travel rule session object you received from the `Create Travel Rule Widget Session`.
const travelRuleSession = {};

// Initialize the widget with the travel rule session.
// Accepts an optional type parameter `TFlow` which narrows
// the type of the `complete` event.
const widget = new TravelRuleWidget<'withdrawal-form'>(travelRuleSession);

// Register event handlers.
widget.on('complete', (e: TravelRuleWidgetCompleteEvent) => {
  // 'complete' event is raised when the user completes the flow.
  console.log(`'complete' event raised. Account id: `, e.detail.selection.id);
  widget.unmount();
});

widget.on('cancel', (_: TravelRuleWidgetCancelEvent) => {
  // 'cancel' event is raised when the user cancels the flow.
  console.log(`'cancel' event raised`);
  widget.unmount();
});

widget.on('error', (e: TravelRuleWidgetErrorEvent) => {
  // 'error' event is raised when the widget encounters an unrecoverable error.
  console.log(`'error' event raised. error: `, e.detail.error);
  widget.unmount();
});

// Mount the widget in an iframe on a DOM element.
widget.mountIframe(document.getElementById('travel-rule-widget-root'));
```

### Debugging

The `debug` option enables additional logging to the console, which can help during development. To enable debugging, set the `debug` option to `true` when initializing the widget:

```javascript
const widget = new TravelRuleWidget(travelRuleSession, { debug: true });
```

## Contributing

### Installing the project

Install the dependencies:

```bash
npm install
```

### Running the project

Check the documentation for the [`widget-test-app`](../../projects/widget-test-app/README.md) project to see how to run the travel rule gateway web SDK test application.

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
