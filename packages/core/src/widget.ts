/**
 * Module dependencies.
 */

import type { WidgetEvent, WidgetMountIframeOptions, WidgetOptions } from './types/base.js';
import type {
  WidgetInitCommandMessage,
  WidgetMessageEvent,
  WidgetSession
} from '@uphold/enterprise-widget-messaging-types';
import { logSymbol } from './constants.js';

/**
 * Widget base class.
 */

class Widget<
  TSession extends WidgetSession,
  TMessageEvent extends WidgetMessageEvent,
  TEvent extends WidgetEvent<TMessageEvent>,
  TWidgetOptions extends WidgetOptions = WidgetOptions
> extends EventTarget {
  #iframe?: HTMLIFrameElement;
  #eventListeners: Map<TEvent['detail']['type'], ((event: TEvent) => void)[]> = new Map();
  session: TSession;
  mountOptions?: WidgetMountIframeOptions;
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

  /**
   * The options passed to the constructor.
   * Set the widget options when creating the session in the back-end. Only `debug` and the options the Widget
   * renders before it loads the session (such as `theme` and `layout`) belong here.
   */
  options?: TWidgetOptions;

  constructor(session: TSession, options?: TWidgetOptions) {
    super();

    this.session = session;
    this.options = options;

    if (this.options?.debug) {
      this[logSymbol].log('Debug mode is enabled.');
    }
  }

  on<T extends TEvent['detail']['type']>(
    event: T,
    listener: (event: Extract<TEvent, { detail: { type: T } }>) => void
  ) {
    this.addEventListener(event, listener as EventListener);

    if (!this.#eventListeners.has(event)) {
      this.#eventListeners.set(event, []);
    }

    this.#eventListeners.get(event)!.push(listener as unknown as (event: TEvent) => void);

    this[logSymbol].log(`Added listener for event: '${event}'.`);
  }

  off<T extends TEvent['detail']['type']>(
    event: T,
    listener: (event: Extract<TEvent, { detail: { type: T } }>) => void
  ) {
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

  protected getIframeAllowAttribute(): string {
    return "clipboard-write 'src'; clipboard-read 'src';";
  }

  unmount() {
    window.removeEventListener('message', this.#widgetEventListener as EventListener);

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

    const url = new URL(this.session.url);

    if (this.options?.theme?.appearance) {
      url.searchParams.set('theme_appearance', this.options.theme.appearance);
    }

    iframe.setAttribute('src', url.toString());
    iframe.setAttribute('allow', this.getIframeAllowAttribute());
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';

    element.appendChild(iframe);

    this.#iframe = iframe;
  }

  #hasSessionToken() {
    try {
      return new URL(this.session.url).searchParams.has('sessionToken');
    } catch {
      return false;
    }
  }

  #emit<T extends TEvent['detail']['type']>(event: T, data?: Extract<TEvent['detail'], { type: T }>) {
    this[logSymbol].log(`'${event}' event raised. Details: `, data);

    this.dispatchEvent(new CustomEvent(event, { detail: data }));
  }

  #sendMessageToWidget(message: WidgetInitCommandMessage) {
    // Outgoing messages must not use the `'*'` wildcard target. The `init` payload carries
    // `session.token` and `session.url` (which itself embeds `sessionToken`); delivering those to
    // `'*'` means a frame-busted, redirected, or reused widget iframe hands the session token to
    // whatever origin now occupies that frame. Incoming messages were already origin-checked in
    // `#widgetEventListener`; the outbound direction is checked here.
    const targetOrigin = this.#sessionOrigin();

    if (!targetOrigin) {
      this[logSymbol].warn(
        '[Host -> Widget] ⚠️ Not sending message because the widget session URL has no usable origin ⚠️'
      );

      return;
    }

    this.#iframe?.contentWindow?.postMessage(message, targetOrigin);
  }

  /**
   * Resolve the origin of the widget session URL.
   *
   * Returns `undefined` rather than throwing when `session.url` is absent or unparseable, so that
   * message routing degrades to "send nothing" instead of taking down the host page.
   */
  #sessionOrigin(): string | undefined {
    if (!this.session?.url) {
      return undefined;
    }

    try {
      return new URL(this.session.url).origin;
    } catch {
      return undefined;
    }
  }

  /**
   * Parse a raw origin string into a normalized origin, or `undefined` when it is opaque or
   * syntactically invalid.
   */
  #originOf(origin: string): string | undefined {
    if (!origin || origin === 'null') {
      return undefined;
    }

    try {
      return new URL(origin).origin;
    } catch {
      return undefined;
    }
  }

  #startWidgetEventsListener() {
    window.addEventListener('message', this.#widgetEventListener as EventListener);
  }

  #widgetEventListener = (event: TMessageEvent) => {
    // `MessageEvent.origin` is the literal string `"null"` for an opaque origin (a sandboxed
    // iframe without `allow-same-origin`, or a `data:`/`blob:`/`file:` document), and
    // `new URL('null')` throws. A single message from any third-party iframe on the merchant page
    // would therefore abort this listener and leave the widget with no response at all. Parse
    // defensively and discard the message when the origin cannot be established.
    const eventOrigin = this.#originOf(event.origin);
    const sessionOrigin = this.#sessionOrigin();

    if (!eventOrigin || !sessionOrigin || eventOrigin !== sessionOrigin) {
      this[logSymbol].warn(
        `[Widget -> Host] ⚠️ Discarding message from '${event.origin}' as it does not match widget origin '${sessionOrigin ?? '(unknown)'}' ⚠️`
      );

      return;
    }

    this[logSymbol].log('[Widget -> Host] ', event.data);

    switch (event.data.type) {
      // This is to force a repaint of the iframe to address
      // a bug that happens when using view transitions API
      // while running the widget in a WKWebView on iOS.
      case 'force_repaint': {
        if (!this.#iframe) {
          break;
        }

        this.#iframe.style.opacity = '0.99';

        setTimeout(() => {
          if (!this.#iframe) {
            return;
          }

          this.#iframe.style.opacity = '1';
        }, 0);

        break;
      }

      case 'load': {
        const hasSessionToken = this.#hasSessionToken();

        if (!hasSessionToken) {
          this[logSymbol].warn(
            '⚠️ The session `url` is missing its `sessionToken` query param. Pass the session `url` unmodified, including its query string. ⚠️'
          );
        }

        // Legacy fallback: send the session data when the session `url` does not include a `sessionToken`.
        const isLegacySession = !hasSessionToken && !!this.session.token;

        const widgetInitMessage = isLegacySession
          ? ({ ...this.session, options: this.options, type: 'init' } as const)
          : ({ options: this.options, type: 'init' } as const);

        this.#sendMessageToWidget(widgetInitMessage);

        this[logSymbol].log('[Host -> Widget] ', widgetInitMessage);

        break;
      }

      case 'complete': {
        this.#emit('complete', event.data as Extract<TEvent['detail'], { type: 'complete' }>);
        break;
      }

      case 'cancel': {
        this.#emit('cancel');
        break;
      }

      case 'error': {
        this.#emit('error', event.data as Extract<TEvent['detail'], { type: 'error' }>);
        break;
      }

      case 'ready': {
        this.#emit('ready');
        break;
      }

      default:
        break;
    }
  };

  #consoleWrapper(prop: 'log' | 'warn' | 'info' | 'error' | 'debug' | 'trace', ...messages: unknown[]) {
    if (this.options?.debug) {
      // eslint-disable-next-line no-console
      console[prop](`[${this.constructor.name}SDK] `, ...messages);
    }
  }
}

/**
 * Exports.
 */

export { Widget };
