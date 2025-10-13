/**
 * Module dependencies.
 */

import { TravelRuleWidget } from './travel-rule-widget';
import type { TravelRuleWidgetSession } from '@uphold/enterprise-widget-messaging-types';
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

describe('TravelRuleWidget', () => {
  const session = {
    data: {
      formParameters: {
        authToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NkstUiJ9',
        nodeUrl: 'https://api.notabene.dev',
        nonCustodialDeclarationType: 'DECLARATION',
        options: {
          allowedAgentTypes: ['WALLET', 'VASP'],
          allowedCounterpartyTypes: ['natural', 'legal', 'self'],
          counterpartyAssist: false,
          proofs: {
            fallbacks: ['self-declaration', 'screenshot'],
            reuseProof: true
          },
          vasps: {
            addUnknown: true
          }
        },
        transactionTypeAllowed: 'ALL',
        vaspDid: 'did:ethr:0x0e8538d083f8a5f3d7682cd2a6fdd3458badd3ff',
        widget: 'https://beta-widget.notabene.dev'
      },
      quote: {
        amount: '1734.623137',
        amountInLowestUnit: '1734623137',
        asset: 'XRP',
        beneficiaryAddress: 'rpJoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        id: '623000c8-9bdf-4a2b-aa3d-6a6b44a7f6a0'
      }
    },
    flow: 'withdrawal-form',
    token: 'eyJhbGciOiJFZERTQSIsImtpZCI6IjllNmUzNmM3LWQ2MzgtNDgyYS1hMTVmLTlkNjg4OWNmNDZkNyIsInR5cCI6IkpXVCJ9',
    url: 'http://localhost:5000'
  } as TravelRuleWidgetSession;

  it('should initialize with session and options', () => {
    const widget = new TravelRuleWidget(session, { debug: true });

    expect(widget.session).toEqual(session);
    expect(widget.options?.debug).toBe(true);
  });

  it('should log debug messages when debug mode is enabled', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    // eslint-disable-next-line no-new
    new TravelRuleWidget(session, { debug: true });

    expect(consoleSpy).toHaveBeenCalledTimes(2);
    expect(consoleSpy.mock.calls[0]).toMatchInlineSnapshot(`
      [
        "[TravelRuleWidget] ",
        "Debug mode is enabled.",
      ]
    `);
    expect(consoleSpy.mock.calls[1]).toMatchInlineSnapshot(`
      [
        "[TravelRuleWidget] ",
        "Initialized travel rule widget. session: ",
        {
          "data": {
            "formParameters": {
              "authToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NkstUiJ9",
              "nodeUrl": "https://api.notabene.dev",
              "nonCustodialDeclarationType": "DECLARATION",
              "options": {
                "allowedAgentTypes": [
                  "WALLET",
                  "VASP",
                ],
                "allowedCounterpartyTypes": [
                  "natural",
                  "legal",
                  "self",
                ],
                "counterpartyAssist": false,
                "proofs": {
                  "fallbacks": [
                    "self-declaration",
                    "screenshot",
                  ],
                  "reuseProof": true,
                },
                "vasps": {
                  "addUnknown": true,
                },
              },
              "transactionTypeAllowed": "ALL",
              "vaspDid": "did:ethr:0x0e8538d083f8a5f3d7682cd2a6fdd3458badd3ff",
              "widget": "https://beta-widget.notabene.dev",
            },
            "quote": {
              "amount": "1734.623137",
              "amountInLowestUnit": "1734623137",
              "asset": "XRP",
              "beneficiaryAddress": "rpJoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
              "id": "623000c8-9bdf-4a2b-aa3d-6a6b44a7f6a0",
            },
          },
          "flow": "withdrawal-form",
          "token": "eyJhbGciOiJFZERTQSIsImtpZCI6IjllNmUzNmM3LWQ2MzgtNDgyYS1hMTVmLTlkNjg4OWNmNDZkNyIsInR5cCI6IkpXVCJ9",
          "url": "http://localhost:5000",
        },
        " options: ",
        {
          "debug": true,
        },
      ]
    `);
  });

  it('should add event listeners using the "on" method', () => {
    const widget = new TravelRuleWidget(session);

    const listener = vi.fn();

    widget.on('complete', listener);

    const event = new CustomEvent('complete', { detail: { success: true } });

    widget.dispatchEvent(event);

    expect(listener).toHaveBeenCalledWith(event);
  });

  it('should remove event listeners using the "off" method', () => {
    const widget = new TravelRuleWidget(session);

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
    const widget = new TravelRuleWidget(session);

    const element = document.createElement('div');
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    const appendChildSpy = vi.spyOn(element, 'appendChild');

    widget.mountIframe(element);

    expect(addEventListenerSpy).toHaveBeenCalledWith('message', expect.any(Function));
    expect(appendChildSpy).toHaveBeenCalledWith(expect.any(HTMLIFrameElement));
  });

  it('should throw an error if the element is invalid during mounting', () => {
    const widget = new TravelRuleWidget(session);

    expect(() => widget.mountIframe(null as unknown as HTMLElement)).toThrow("Type of 'element' parameter is invalid");
  });

  it('should unmount the iframe and remove event listeners', () => {
    const widget = new TravelRuleWidget(session);

    const element = document.createElement('div');

    widget.mountIframe(element);

    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

    widget.unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('message', expect.any(Function));
    expect(element.querySelector('iframe')).toBeNull();
  });

  it('should handle messages from the widget', () => {
    const widget = new TravelRuleWidget(session, { debug: true });

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
    const widget = new TravelRuleWidget(session, { debug: true });

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
});
