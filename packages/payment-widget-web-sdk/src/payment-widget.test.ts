/**
 * Module dependencies.
 */

import { PaymentWidget } from './payment-widget.js';
import type { PaymentWidgetSession } from '@uphold/enterprise-widget-messaging-types';
import { describe, expect, it, vi } from 'vitest';

/**
 * Mocks.
 */

// eslint-disable-next-line no-console
console.log = vi.fn();
// eslint-disable-next-line no-console
console.warn = vi.fn();

/**
 * Tests.
 */

describe('PaymentWidget', () => {
  const session = {
    url: 'https://localhost:5000'
  } as PaymentWidgetSession;

  it('should initialize with session and options', () => {
    const widget = new PaymentWidget(session, { debug: true });

    expect(widget.session).toEqual(session);
    expect(widget.options?.debug).toBe(true);
  });

  it('should log debug messages when debug mode is enabled', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    // eslint-disable-next-line no-new
    new PaymentWidget(session, { debug: true });

    expect(consoleSpy).toHaveBeenCalledTimes(2);
    expect(consoleSpy.mock.calls[0]).toMatchInlineSnapshot(`
      [
        "[PaymentWidget] ",
        "Debug mode is enabled.",
      ]
    `);
    expect(consoleSpy.mock.calls[1]).toMatchInlineSnapshot(`
      [
        "[PaymentWidget] ",
        "Initialized payment widget. session: ",
        {
          "url": "https://localhost:5000",
        },
        " options: ",
        {
          "debug": true,
        },
      ]
    `);
  });

  it('should add event listeners using the "on" method', () => {
    const widget = new PaymentWidget(session);

    const listener = vi.fn();

    widget.on('complete', listener);

    const event = new CustomEvent('complete', { detail: { success: true } });

    widget.dispatchEvent(event);

    expect(listener).toHaveBeenCalledWith(event);
  });

  it('should remove event listeners using the "off" method', () => {
    const widget = new PaymentWidget(session);

    const listener = vi.fn();

    widget.on('complete', listener);
    widget.off('complete', listener);

    const event = new CustomEvent('complete', {
      detail: { externalAccountId: '9d70aa35-9760-43c4-a97f-4c48d2b4aa10' }
    });

    widget.dispatchEvent(event);

    expect(listener).not.toHaveBeenCalled();
  });

  it('should mount an iframe and start event listeners', () => {
    const widget = new PaymentWidget(session);

    const element = document.createElement('div');
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    const appendChildSpy = vi.spyOn(element, 'appendChild');

    widget.mountIframe(element);

    expect(addEventListenerSpy).toHaveBeenCalledWith('message', expect.any(Function));
    expect(appendChildSpy).toHaveBeenCalledWith(expect.any(HTMLIFrameElement));
  });

  it(`should add "payment 'src'" to the iframe allow attribute`, () => {
    const widget = new PaymentWidget(session);

    const element = document.createElement('div');

    widget.mountIframe(element);

    expect(element.querySelector('iframe')?.getAttribute('allow')).toBe(
      "clipboard-write 'src'; clipboard-read 'src'; payment 'src';"
    );
  });

  it('should throw an error if the element is invalid during mounting', () => {
    const widget = new PaymentWidget(session);

    expect(() => widget.mountIframe(null as unknown as HTMLElement)).toThrow("Type of 'element' parameter is invalid");
  });

  it('should unmount the iframe and remove event listeners', () => {
    const widget = new PaymentWidget(session);

    const element = document.createElement('div');

    widget.mountIframe(element);

    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

    widget.unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('message', expect.any(Function));
    expect(element.querySelector('iframe')).toBeNull();
  });

  it('should handle messages from the widget', () => {
    const widget = new PaymentWidget(session, { debug: true });

    const listener = vi.fn();

    widget.on('complete', listener);

    const element = document.createElement('div');

    widget.mountIframe(element);

    const messageEvent = new MessageEvent('message', {
      data: { detail: { externalAccountId: true }, type: 'complete' },
      origin: session.url
    });

    window.dispatchEvent(messageEvent);

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener.mock.calls[0]?.[0].detail).toMatchInlineSnapshot(`
      {
        "detail": {
          "externalAccountId": true,
        },
        "type": "complete",
      }
    `);
  });

  it('should ignore messages from unknown origins', () => {
    const widget = new PaymentWidget(session, { debug: true });

    const listener = vi.fn();

    widget.on('complete', listener);

    const element = document.createElement('div');

    widget.mountIframe(element);

    const messageEvent = new MessageEvent('message', {
      data: { detail: { externalAccountId: true }, type: 'complete' },
      origin: 'http://unknown.origin.com'
    });

    window.dispatchEvent(messageEvent);

    expect(listener).toHaveBeenCalledTimes(0);
  });

  it('should mount an iframe when the session only contains a url with a `sessionToken`, since the session data is now loaded via the API', () => {
    const sessionWithToken = { url: 'https://localhost:5000?sessionToken=abc123' } as PaymentWidgetSession;
    const widget = new PaymentWidget(sessionWithToken);
    const element = document.createElement('div');

    widget.mountIframe(element);

    expect(element.querySelector('iframe')?.getAttribute('src')).toBe('https://localhost:5000/?sessionToken=abc123');
  });
});
