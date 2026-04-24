/* eslint-disable jsdoc/check-tag-names */
/* eslint-disable jsdoc/require-description-complete-sentence */

/**
 * Module dependencies.
 */

import type { KycWidgetEvent, KycWidgetOptions, KycWidgetSession } from './types/index.js';
import type { KycWidgetMessageEvent } from '@uphold/enterprise-widget-messaging-types';
import { Widget, type WidgetMountIframeOptions, logSymbol } from '@uphold/enterprise-widget-sdk-core';

/**
 * The `KycWidget` class provides an interface for embedding and interacting with
 * the Enterprise KYC Widget in web applications. It extends the base `Widget` class
 * and is specifically designed to handle KYC-related sessions and events.
 *
 * This class allows developers to:
 * - Mount the KYC widget into a specified DOM element.
 * - Manage the lifecycle of the widget, including initialization and unmounting.
 * - Listen for and handle KYC-related events, such as completion, cancellation, or errors.
 *
 * Example usage:
 *
 * ```typescript
 * import { KycWidget } from '@uphold/enterprise-kyc-widget-web-sdk';
 *
 * const kycWidget = new KycWidget(kycSession);
 * kycWidget.mountIframe(document.getElementById('widget-container'));
 *
 * kycWidget.on('complete', (event) => {
 *   console.log('KYC completed.');
 *
 *   kycWidget.unmount();
 * });
 * @public
 * ```
 */
class KycWidget extends Widget<KycWidgetSession, KycWidgetMessageEvent, KycWidgetEvent, KycWidgetOptions> {
  /**
   * Creates a new instance of a KYC Widget.
   *
   * This constructor initializes the KYC widget with the provided session data, which includes
   * the session URL and other configuration details required for the widget's operation.
   *
   * ### Example Usage:
   * ```typescript
   * const session = { url: 'https://example.com', token: 'token' };
   * const kycWidget = new KycWidget(session);
   * ```
   *
   * ### Advanced Usage with KYC Processes:
   * You can optionally specify which KYC processes should be available on the widget using the `options` parameter:
   *
   * ```typescript
   * const session = { url: 'https://example.com', token: 'token' };
   * const options = {
   *   processes: ['identity', 'proof-of-address']
   * };
   * const kycWidget = new KycWidget(session, options);
   * ```
   *
   * @param session The session object containing the configuration details for the widget.
   * This includes the session URL and any other data required to initialize the widget.
   */
  constructor(session: KycWidgetSession, options?: KycWidgetOptions) {
    super(session, options);

    this[logSymbol].log('Initialized kyc widget. session: ', session, ' options: ', options);
  }

  /**
   * Mounts the KYC widget in an iframe under the specified DOM element.
   *
   * It initializes the KYC widget with the provided KYC session
   * and configures it to handle KYC-related events.
   *
   * @param element The DOM element where the iframe will be mounted.
   * This element must be a valid `HTMLElement` and should exist in the DOM.
   * @param mountOptions Options to customize the iframe mounting process.
   * Currently, no options are supported, but this parameter is reserved for future use.
   *
   * @throws {TypeError} If the `element` parameter is not a valid `HTMLElement`.
   * @throws {Error} If an error occurs while mounting the widget.
   */
  override mountIframe(element: HTMLElement, mountOptions?: WidgetMountIframeOptions) {
    super.mountIframe(element, mountOptions);
  }

  /**
   * Adds an event listener for the specified event type. This allows you to listen for
   * and handle events emitted by the KYC widget during its lifecycle. The available events
   * and their descriptions are as follows:
   *
   * - **load**: Triggered when the widget has been loaded but is not yet ready for interaction.
   * - **ready**: Triggered when the widget is fully initialized and ready for interaction.
   * - **complete**: Triggered when the user successfully completes the KYC process.
   * - **cancel**: Triggered when the user cancels the process.
   * - **error**: Triggered when an unrecoverable error occurs, preventing the process from completing.
   *
   * Example usage:
   *
   * ```typescript
   * kycWidget.on('complete', (event) => {
   *   console.log('KYC completed: ', event.detail);
   * });
   * ```
   *
   * @param event The name of the event to listen for. Examples: `'load'`, `'ready'`, `'complete'`, `'cancel'`, `'error'`.
   * @param listener The callback function to execute when the event is triggered.
   * The callback receives the event object as a parameter, which contains additional details about the event.
   */
  override on<T extends KycWidgetEvent['detail']['type']>(
    event: T,
    listener: (event: Extract<KycWidgetEvent, { detail: { type: T } }>) => void
  ) {
    super.on(event, listener);
  }

  /**
   * Removes an event listener for the specified event type.
   *
   * This method allows you to unregister a previously registered event listener for a specific event type.
   * It ensures that the listener is no longer called when the event is triggered. If the listener is not
   * found, the method silently does nothing.
   *
   * ### Example Usage:
   * ```typescript
   * const onComplete = (event) => {
   *   console.log('KYC completed: ', event.detail);
   * };
   *
   * kycWidget.on('complete', onComplete);
   * kycWidget.off('complete', onComplete); // Removes the listener
   * ```
   *
   * @param event The name of the event to remove the listener from. Examples: `'complete'`, `'cancel'`, `'error'`.
   * The event must match the name used when the listener was registered.
   * @param listener The callback function that was previously registered for the event.
   * This must be the same function reference that was passed to the `on` method.
   *
   * @throws {Error} If the `listener` parameter is not a function.
   */
  override off<T extends KycWidgetEvent['detail']['type']>(
    event: T,
    listener: (event: Extract<KycWidgetEvent, { detail: { type: T } }>) => void
  ) {
    super.off(event, listener);
  }

  /**
   * Unmounts the KYC widget and removes any registered event listeners.
   *
   * This method is used to clean up the KYC widget when it is no longer needed. It performs the following actions:
   * - Unregisters all event listeners that were added using the `on` method.
   * - Removes the iframe element from the DOM, ensuring that the widget is fully unmounted.
   *
   * ### Example Usage:
   * ```typescript
   * const kycWidget = new KycWidget(session);
   * kycWidget.mountIframe(document.getElementById('widget-container'));
   *
   * // Later, when the widget is no longer needed
   * kycWidget.unmount();
   * ```
   *
   * @remarks
   * It is recommended to call this method whenever the widget is no longer needed, such as when navigating away
   * from the page or when the widget's lifecycle has ended. Failing to call this method may result in memory leaks
   * or lingering event listeners.
   */
  override unmount(): void {
    super.unmount();
  }
}

/**
 * Exports.
 */

export { KycWidget };
