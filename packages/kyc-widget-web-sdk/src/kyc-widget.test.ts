/**
 * Module dependencies.
 */

import { KycWidget } from './kyc-widget.js';
import type { KycWidgetSession } from './types/index.js';
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

describe('KycWidget', () => {
  const session: KycWidgetSession = {
    url: 'https://localhost:5000'
  };

  it('should initialize with session and options', () => {
    const widget = new KycWidget(session, { debug: true });

    expect(widget.session).toEqual(session);
    expect(widget.options?.debug).toBe(true);
  });

  it('should log debug messages when debug mode is enabled', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    // eslint-disable-next-line no-new
    new KycWidget(session, { debug: true });

    expect(consoleSpy).toHaveBeenCalledTimes(2);
    expect(consoleSpy.mock.calls[0]).toMatchInlineSnapshot(`
      [
        "[KycWidget] ",
        "Debug mode is enabled.",
      ]
    `);
    expect(consoleSpy.mock.calls[1]).toMatchInlineSnapshot(`
      [
        "[KycWidget] ",
        "Initialized kyc widget. session: ",
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
    const widget = new KycWidget(session);

    const listener = vi.fn();

    widget.on('complete', listener);

    const event = new CustomEvent('complete', { detail: { success: true } });

    widget.dispatchEvent(event);

    expect(listener).toHaveBeenCalledWith(event);
  });

  it('should remove event listeners using the "off" method', () => {
    const widget = new KycWidget(session);

    const listener = vi.fn();

    widget.on('complete', listener);
    widget.off('complete', listener);

    const event = new CustomEvent('complete', { detail: { success: true } });

    widget.dispatchEvent(event);

    expect(listener).not.toHaveBeenCalled();
  });

  it('should mount an iframe and start event listeners', () => {
    const widget = new KycWidget(session);

    const element = document.createElement('div');
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    const appendChildSpy = vi.spyOn(element, 'appendChild');

    widget.mountIframe(element);

    expect(addEventListenerSpy).toHaveBeenCalledWith('message', expect.any(Function));
    expect(appendChildSpy).toHaveBeenCalledWith(expect.any(HTMLIFrameElement));
  });

  it('should throw an error if the element is invalid during mounting', () => {
    const widget = new KycWidget(session);

    expect(() => widget.mountIframe(null as unknown as HTMLElement)).toThrow("Type of 'element' parameter is invalid");
  });

  it('should unmount the iframe and remove event listeners', () => {
    const widget = new KycWidget(session);

    const element = document.createElement('div');

    widget.mountIframe(element);

    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

    widget.unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('message', expect.any(Function));
    expect(element.querySelector('iframe')).toBeNull();
  });

  it('should handle messages from the widget', () => {
    const widget = new KycWidget(session, { debug: true });

    const listener = vi.fn();

    widget.on('complete', listener);

    const element = document.createElement('div');

    widget.mountIframe(element);

    const messageEvent = new MessageEvent('message', {
      data: { detail: {}, type: 'complete' },
      origin: session.url
    });

    window.dispatchEvent(messageEvent);

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener.mock.calls[0]?.[0].detail).toMatchInlineSnapshot(`
      {
        "detail": {},
        "type": "complete",
      }
    `);
  });

  it('should ignore messages from unknown origins', () => {
    const widget = new KycWidget(session, { debug: true });

    const listener = vi.fn();

    widget.on('complete', listener);

    const element = document.createElement('div');

    widget.mountIframe(element);

    const messageEvent = new MessageEvent('message', {
      data: { detail: {}, type: 'complete' },
      origin: 'http://unknown.origin.com'
    });

    window.dispatchEvent(messageEvent);

    expect(listener).toHaveBeenCalledTimes(0);
  });

  it('should mount an iframe when the session only contains a url with a `sessionToken`, since the session data is now loaded via the API', () => {
    const sessionWithToken: KycWidgetSession = { url: 'https://localhost:5000?sessionToken=abc123' };
    const widget = new KycWidget(sessionWithToken);
    const element = document.createElement('div');

    widget.mountIframe(element);

    expect(element.querySelector('iframe')?.getAttribute('src')).toBe('https://localhost:5000/?sessionToken=abc123');
  });
});
