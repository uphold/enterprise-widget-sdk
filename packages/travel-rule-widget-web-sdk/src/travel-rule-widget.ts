/* eslint-disable jsdoc/check-tag-names */
/* eslint-disable jsdoc/require-description-complete-sentence */

/**
 * Module dependencies.
 */

import type { TravelRuleWidgetEvent } from './types';
import type {
  TravelRuleWidgetFlow,
  TravelRuleWidgetMessageEvent,
  TravelRuleWidgetSession
} from '@uphold/enterprise-widget-messaging-types';
import {
  Widget,
  type WidgetMountIframeOptions,
  type WidgetOptions,
  logSymbol
} from '@uphold/enterprise-widget-sdk-core';

/**
 * The `TravelRuleWidget` class provides an interface for embedding and interacting with
 * the Enterprise Travel Rule Widget in web applications. It extends the base `Widget` class
 * and is specifically designed to handle travel rule related sessions and events.
 *
 * This class allows developers to:
 * - Mount the travel rule widget into a specified DOM element.
 * - Manage the lifecycle of the widget, including initialization and unmounting.
 * - Listen for and handle travel rule related events, such as completion, cancellation, or errors.
 *
 * Example usage:
 *
 * ```typescript
 * import { TravelRuleWidget } from '@uphold/enterprise-travel-rule-widget-web-sdk';
 *
 * const travelRuleWidget = new TravelRuleWidget(travelRuleSession);
 * travelRuleWidget.mountIframe(document.getElementById('widget-container'));
 *
 * travelRuleWidget.on('complete', (event) => {
 *   console.log('Travel Rule completed. Selected account id: ', event.detail.externalAccountId);
 *
 *   travelRuleWidget.unmount();
 * });
 * @template TFlow - (optional) The type of the travel rule widget flow. This determines the specific
 * flow-related events and data that the widget will handle.
 * @public
 * ```
 */
class TravelRuleWidget<TFlow extends TravelRuleWidgetFlow = TravelRuleWidgetFlow> extends Widget<
  TravelRuleWidgetSession,
  TravelRuleWidgetMessageEvent,
  TravelRuleWidgetEvent<TFlow>
> {
  /**
   * Creates a new instance of a Travel Rule Widget.
   *
   * This constructor initializes the travel rule widget with the provided session data, which includes
   * the session URL and other configuration details required for the widget's operation.
   *
   * ### Example Usage:
   * ```typescript
   * const session = { url: 'https://example.com/widget-session' };
   * const travelRuleWidget = new TravelRuleWidget(session);
   * ```
   *
   * @param session The session object containing the configuration details for the widget.
   * This includes the session URL and any other data required to initialize the widget.
   */
  constructor(session: TravelRuleWidgetSession, options?: WidgetOptions) {
    super(session, options);

    this[logSymbol].log('Initialized travel rule widget. session: ', session, ' options: ', options);
  }

  /**
   * Mounts the travel rule widget in an iframe under the specified DOM element.
   *
   * It initializes the travel rule widget with the provided travel rule session
   * and configures it to handle travel rule-related events.
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
   * and handle events emitted by the travel rule widget during its lifecycle. The available events
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
   * travelRuleWidget.on('complete', (event) => {
   *   console.log('Flow completed: ', event.detail);
   * });
   * ```
   *
   * @param event The name of the event to listen for. Examples: `'load'`, `'ready'`, `'complete'`, `'cancel'`, `'error'`.
   * @param listener The callback function to execute when the event is triggered.
   * The callback receives the event object as a parameter, which contains additional details about the event.
   */
  override on<T extends TravelRuleWidgetEvent['detail']['type']>(
    event: T,
    listener: (event: Extract<TravelRuleWidgetEvent<TFlow>, { detail: { type: T } }>) => void
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
   * travelRuleWidget.on('complete', onComplete);
   * travelRuleWidget.off('complete', onComplete); // Removes the listener
   * ```
   *
   * @param event The name of the event to remove the listener from. Examples: `'complete'`, `'cancel'`, `'error'`.
   * The event must match the name used when the listener was registered.
   * @param listener The callback function that was previously registered for the event.
   * This must be the same function reference that was passed to the `on` method.
   *
   * @throws {Error} If the `listener` parameter is not a function.
   */
  override off<T extends TravelRuleWidgetEvent['detail']['type']>(
    event: T,
    listener: (event: Extract<TravelRuleWidgetEvent<TFlow>, { detail: { type: T } }>) => void
  ) {
    super.off(event, listener);
  }

  /**
   * Unmounts the travel rule widget and removes any registered event listeners.
   *
   * This method is used to clean up the travel rule widget when it is no longer needed. It performs the following actions:
   * - Unregisters all event listeners that were added using the `on` method.
   * - Removes the iframe element from the DOM, ensuring that the widget is fully unmounted.
   *
   * ### Example Usage:
   * ```typescript
   * const travelRuleWidget = new TravelRuleWidget(session);
   * travelRuleWidget.mountIframe(document.getElementById('widget-container'));
   *
   * // Later, when the widget is no longer needed
   * travelRuleWidget.unmount();
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

export { TravelRuleWidget };
