/**
 * Module dependencies.
 */

import type { EventByType, WidgetEvent, WidgetMountIframeOptions, WidgetOptions } from './types/base';
import type {
  WidgetCommandMessage,
  WidgetMessageEvent,
  WidgetSession
} from '@uphold/enterprise-widget-messaging-types';
import { logSymbol } from './constants';

/**
 * Widget base class.
 */

class Widget<Session extends WidgetSession, Event extends WidgetEvent> extends EventTarget {
  #iframe?: HTMLIFrameElement;
  #eventListeners: Map<Event['type'], ((event: Event) => void)[]> = new Map();
  session: Session;
  mountOptions?: WidgetMountIframeOptions;
  options?: WidgetOptions;
  [logSymbol] = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    log: (message?: any, ...optionalParams: any[]) => {
      this.#consoleWrapper('log', message, ...optionalParams);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    warn: (message?: any, ...optionalParams: any[]) => {
      this.#consoleWrapper('warn', message, ...optionalParams);
    }
  };

  constructor(session: Session, options?: WidgetOptions) {
    super();

    this.session = session;
    this.options = options;

    if (this.options?.debug) {
      this[logSymbol].log('Debug mode is enabled.');
    }
  }

  on<T extends Event['type']>(event: T, listener: (event: EventByType<Event, T>) => void) {
    this.addEventListener(event, listener as EventListener);

    if (!this.#eventListeners.has(event)) {
      this.#eventListeners.set(event, []);
    }

    this.#eventListeners.get(event)!.push(listener as unknown as (event: Event) => void);

    this[logSymbol].log(`Added listener for event: '${event}'.`);
  }

  off(event: Event['type'], listener: (event: Event) => void) {
    this.removeEventListener(event, listener as unknown as EventListener);

    if (this.#eventListeners.has(event)) {
      const listeners = this.#eventListeners.get(event)!.filter(currentListener => currentListener !== listener);

      if (listeners.length > 0) {
        this.#eventListeners.set(event, listeners);
      } else {
        this.#eventListeners.delete(event);
      }
    }

    this[logSymbol].log(`Removed listener for event: '${event}'.`);
  }

  mountIframe(element: HTMLElement, mountOptions?: WidgetMountIframeOptions) {
    this[logSymbol].log('Validating element and initializing iframe mounting.');

    if (!element || !(element instanceof HTMLElement)) {
      throw new TypeError(`Type of 'element' parameter is invalid`);
    }

    this.mountOptions = mountOptions;

    try {
      this[logSymbol].log('Starting widget event listener.');

      this.#startWidgetEventsListener();

      this[logSymbol].log('Creating and appending iframe to the DOM.');

      this.#createIframe(element);

      this[logSymbol].log('Widget successfully mounted.');
    } catch (e) {
      this[logSymbol].log('Error occurred while mounting the widget in iframe: ', e as Error);

      this.unmount();

      throw new Error('Unable to mount widget: ', { cause: e });
    }
  }

  unmount() {
    window.removeEventListener('message', this.#widgetEventListener);

    this.#eventListeners.forEach((listeners, event) => {
      listeners.forEach(listener => this.removeEventListener(event, listener as EventListener));
    });

    this.#eventListeners.clear();

    // Remove the iframe from the DOM
    if (this.#iframe) {
      this.#iframe.remove();
      this.#iframe = undefined;
    }
  }

  #createIframe(element: HTMLElement) {
    const iframe = document.createElement('iframe');

    iframe.setAttribute('src', this.session.url);
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';

    element.appendChild(iframe);

    this.#iframe = iframe;
  }

  #emit(event: Event['type'], data: Event['detail'] = {}) {
    this[logSymbol].log(`'${event}' event raised. Details: `, data);

    this.dispatchEvent(new CustomEvent(event, { detail: data }));
  }

  #sendMessageToWidget(message: WidgetCommandMessage) {
    this.#iframe?.contentWindow?.postMessage(message, '*');
  }

  #startWidgetEventsListener() {
    window.addEventListener('message', this.#widgetEventListener);
  }

  #widgetEventListener = (event: WidgetMessageEvent) => {
    const eventOrigin = new URL(event.origin).origin;

    if (eventOrigin !== this.session.url) {
      this[logSymbol].warn(
        `[Widget -> Host] ⚠️ Discarding message from '${eventOrigin}' as it does not match widget URL '${this.session.url}' ⚠️.`
      );

      return;
    }

    this[logSymbol].log('[Widget -> Host] ', event.data);

    switch (event.data.type) {
      case 'load': {
        const widgetInitMessage = {
          ...this.session,
          type: 'init'
        } as const;

        this.#sendMessageToWidget(widgetInitMessage);

        this[logSymbol].log('[Host -> Widget] ', widgetInitMessage);

        break;
      }

      case 'complete': {
        this.#emit('complete', event.data);
        break;
      }

      case 'cancel': {
        this.#emit('cancel');
        break;
      }

      case 'error': {
        this.#emit('error', event.data);
        break;
      }

      default:
        break;
    }
  };

  #consoleWrapper(prop: 'log' | 'warn' | 'info' | 'error' | 'debug' | 'trace', ...messages: unknown[]) {
    if (this.options?.debug) {
      // eslint-disable-next-line no-console
      console[prop](`[${this.constructor.name}] `, ...messages);
    }
  }
}

/**
 * Exports.
 */

export { Widget };
