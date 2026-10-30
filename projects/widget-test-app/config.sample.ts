/**
 * Export default config.
 */

export const config = {
  enterpriseApi: {
    apis: {
      core: {
        // Base url for the enterprise `core` API. (required)
        baseUrl: '<core_api_base_url>'
      },
      onOffRamp: {
        // Base url for the enterprise `on-off-ramp` API. (required for the `order:authorize-deposit` flow)
        baseUrl: '<on_off_ramp_api_base_url>'
      },
      widgets: {
        // Base url for the enterprise `widgets` API. (required)
        baseUrl: '<widgets_api_base_url>'
      }
    },
    authentication: {
      // Client ID used for authenticating against the API. (required)
      clientId: '<client_id>',
      // Corresponding client secret in plain-text. (required)
      clientSecret: '<client_secret>',
      // Value used for the header `X-On-Behalf-Of` in requests that require it. (required)
      onBehalfOf: 'user <user_id>'
    }
  },
  widgets: {
    kyc: {
      session: {
        // URL to override the response url from the kyc widget session.
        // required when you want to test the kyc widget locally.
        // Uncomment the line below to override the kyc widget session's url
        // to point to the local kyc widget.
        // urlOverride: 'http://localhost:8790'
      }
    },
    payment: {
      flows: {
        authorize: {
          // Body for the create quote request used in `authorize` flow. (Optional when flow is not `authorize`)
          createQuoteBody: {
            denomination: {
              amount: '10',
              asset: 'XRP',
              target: 'origin'
            },
            destination: {
              id: '<account_id>',
              type: 'account'
            },
            origin: {
              id: '<external_account_id>',
              type: 'external_account'
            }
          }
        },
        'order-authorize-deposit-card': {
          // Body for the create order quote request used in the `order:authorize-deposit` flow, with a card origin.
          // The card must be an external account of the user.
          createQuoteBody: {
            denomination: {
              amount: '100',
              asset: 'USD',
              target: 'origin'
            },
            destination: {
              address: '<crypto_address>',
              asset: 'XRP',
              network: 'xrp-ledger',
              type: 'crypto-address'
            },
            origin: {
              id: '<card_external_account_id>',
              type: 'external-account'
            },
            type: 'on-ramp'
          }
        },
        'order-authorize-deposit-paypal': {
          // Body for the create order quote request used in the `order:authorize-deposit` flow, with a PayPal origin.
          // Change `method` to test the other alternative payment methods (`venmo`, `apple-pay`, `google-pay`).
          createQuoteBody: {
            denomination: {
              amount: '100',
              asset: 'USD',
              target: 'origin'
            },
            destination: {
              address: '<crypto_address>',
              asset: 'XRP',
              network: 'xrp-ledger',
              type: 'crypto-address'
            },
            origin: {
              method: 'paypal',
              type: 'apm'
            },
            type: 'on-ramp'
          }
        },
        'paypal-authorize': {
          // Example `authorize` configuration for the `paypal` flow.
          // Body for the create quote request used in `paypal-authorize` flow.
          // Creates a quote with a PayPal APM origin, then fetches a Braintree client token
          // and riskCorrelationId automatically before launching the authorize widget.
          createQuoteBody: {
            denomination: {
              amount: '50',
              asset: 'USD',
              target: 'origin'
            },
            destination: {
              id: '<account_id>',
              type: 'account'
            },
            origin: {
              method: 'paypal',
              type: 'apm'
            }
          }
        },
        'venmo-authorize': {
          // Example `authorize` configuration for the `venmo` flow.
          // Body for the create quote request used in `venmo-authorize` flow.
          // Creates a quote with a Venmo APM origin, then fetches a Braintree client token
          // and riskCorrelationId automatically before launching the authorize widget.
          createQuoteBody: {
            denomination: {
              amount: '50',
              asset: 'USD',
              target: 'origin'
            },
            destination: {
              id: '<account_id>',
              type: 'account'
            },
            origin: {
              method: 'venmo',
              type: 'apm'
            }
          }
        }
      },
      session: {
        // URL to override the response url from the payment widget session.
        // required when you want to test the payment widget locally.
        // Uncomment the line below to override the payment widget session's url
        // to point to the local payment widget.
        // urlOverride: 'http://localhost:8788'
      }
    },
    travelRule: {
      session: {
        // URL to override the response url from the travel rule widget session.
        // required when you want to test the travel rule widget locally.
        // Uncomment the line below to override the travel rule widget session's url
        // to point to the local travel rule widget.
        // urlOverride: 'http://localhost:8787'
      }
    }
  }
};
