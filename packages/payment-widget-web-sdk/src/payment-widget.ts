/* eslint-disable jsdoc/check-tag-names */
/* eslint-disable jsdoc/require-description-complete-sentence */

/**
 * Module dependencies.
 */

import type { EventByType, PaymentWidgetEvent, WidgetMountIframeOptions, WidgetOptions } from './types';
import type { PaymentWidgetSession } from '@uphold/enterprise-widget-messaging-types';
import { Widget } from './widget';
import { logSymbol } from './constants';

/**
 * The `PaymentWidget` class provides an interface for embedding and interacting with
 * the Enterprise Payment Widget in web applications. It extends the base `Widget` class
 * and is specifically designed to handle payment-related sessions and events.
 *
 * This class allows developers to:
 * - Mount the payment widget into a specified DOM element.
 * - Manage the lifecycle of the widget, including initialization and unmounting.
 * - Listen for and handle payment-related events, such as completion, cancellation, or errors.
 *
 * Example usage:
 *
 * ```typescript
 * import { PaymentWidget } from '@uphold/enterprise-payment-widget-web-sdk';
 *
 * const paymentWidget = new PaymentWidget(paymentSession);
 * paymentWidget.mountIframe(document.getElementById('widget-container'));
 *
 * paymentWidget.on('complete', (event) => {
 *   console.log('Payment completed. Selected account id: ', event.detail.externalAccountId);
 *
 *   paymentWidget.unmount();
 * });
 *
 * @public
 * ```
 */
class PaymentWidget extends Widget<PaymentWidgetSession, PaymentWidgetEvent> {
  /**
   * Creates a new instance of a Payment Widget.
   *
   * This constructor initializes the payment widget with the provided session data, which includes
   * the session URL and other configuration details required for the widget's operation.
   *
   * ### Example Usage:
   * ```typescript
   * const session = { url: 'https://example.com/widget-session' };
   * const paymentWidget = new PaymentWidget(session);
   * ```
   *
   * @param session The session object containing the configuration details for the widget.
   * This includes the session URL and any other data required to initialize the widget.
   */
  constructor(session: PaymentWidgetSession, options?: WidgetOptions) {
    super(session, options);

    this[logSymbol].log('Initialized payment widget. session: ', session, ' options: ', options);
  }

  /**
   * Mounts the payment widget in an iframe under the specified DOM element.
   *
   * It initializes the payment widget with the provided payment session
   * and configures it to handle payment-related events.
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
   * and handle events emitted by the payment widget during its lifecycle. The available events
   * and their descriptions are as follows:
   *
   * - **load**: Triggered when the widget has been loaded but is not yet ready for interaction.
   * - **ready**: Triggered when the widget is fully initialized and ready for interaction.
   * - **complete**: Triggered when the user successfully completes the specified flow. The event
   *   will include additional data depending on the flow.
   * - **cancel**: Triggered when the user cancels the flow.
   * - **error**: Triggered when an unrecoverable error occurs, preventing the flow from completing.
   *
   * Example usage:
   *
   * ```typescript
   * paymentWidget.on('complete', (event) => {
   *   console.log('Flow completed: ', event.detail);
   * });
   * ```
   *
   * @param event The name of the event to listen for. Examples: `'load'`, `'ready'`, `'complete'`, `'cancel'`, `'error'`.
   * @param listener The callback function to execute when the event is triggered.
   * The callback receives the event object as a parameter, which contains additional details about the event.
   */
  override on<T extends PaymentWidgetEvent['type']>(
    event: T,
    listener: (event: EventByType<PaymentWidgetEvent, T>) => void
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
   *   console.log('Flow completed: ', event.detail);
   * };
   *
   * paymentWidget.on('complete', onComplete);
   * paymentWidget.off('complete', onComplete); // Removes the listener
   * ```
   *
   * @param event The name of the event to remove the listener from. Examples: `'complete'`, `'cancel'`, `'error'`.
   * The event must match the name used when the listener was registered.
   * @param listener The callback function that was previously registered for the event.
   * This must be the same function reference that was passed to the `on` method.
   *
   * @throws {Error} If the `listener` parameter is not a function.
   */
  override off(event: PaymentWidgetEvent['type'], listener: (event: PaymentWidgetEvent) => void) {
    super.off(event, listener);
  }

  /**
   * Unmounts the payment widget and removes any registered event listeners.
   *
   * This method is used to clean up the payment widget when it is no longer needed. It performs the following actions:
   * - Unregisters all event listeners that were added using the `on` method.
   * - Removes the iframe element from the DOM, ensuring that the widget is fully unmounted.
   *
   * ### Example Usage:
   * ```typescript
   * const paymentWidget = new PaymentWidget(session);
   * paymentWidget.mountIframe(document.getElementById('widget-container'));
   *
   * // Later, when the widget is no longer needed
   * paymentWidget.unmount();
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

export { PaymentWidget };
