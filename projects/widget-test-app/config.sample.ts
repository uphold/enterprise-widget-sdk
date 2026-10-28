/**
 * Export default config.
 */

export const config = {
  // Key of the environment selected when none was picked in the UI (or via the `?env=<key>` query param). (required)
  defaultEnvironment: 'connectivity',

  // API used by the kyc and travel rule widgets, which don't follow the environment selector.
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

  // Environments you can switch between using the selector at the top right of the app. (required)
  // Each environment has its own API, credentials and users.
  environments: {
    connectivity: {
      // Key of the user selected when none was picked in the UI (or via the `?user=<key>` query param). (required)
      defaultUser: 'us-1',
      enterpriseApi: {
        apis: {
          core: {
            // Base url for the enterprise `core` API. (required)
            baseUrl: '<core_api_base_url>'
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
          clientSecret: '<client_secret>'
        }
      },
      // Label shown in the environment selector.
      label: 'Connectivity',
      // Users of this environment. (required)
      // The selected user is sent in the `X-On-Behalf-Of` header and its accounts are used by the flows.
      users: {
        'gb-1': {
          // Account ids keyed by asset code.
          accounts: {
            BTC: '<btc_account_id>',
            GBP: '<gbp_account_id>'
          },
          // Main fiat asset of the user, used to pick its fiat account.
          fiatAsset: 'GBP',
          // User id.
          id: '<user_id>',
          // Label shown in the user selector.
          label: 'GB #1'
        },

        'us-1': {
          accounts: {
            BTC: '<btc_account_id>',
            USD: '<usd_account_id>'
          },
          fiatAsset: 'USD',
          id: '<user_id>',
          label: 'US #1'
        }
      },
      // Widget settings of this environment. (optional)
      widgets: {
        payment: {
          session: {
            // URL to override the response url from the payment widget session.
            // required when you want to test the payment widget locally.
            // The local widget must be running against this environment's API, as the session only exists here.
            // Uncomment the line below to override the payment widget session's url
            // to point to the local payment widget.
            // urlOverride: 'http://localhost:8788'
          }
        }
      }
    },
    enterprise: {
      defaultUser: 'gb-1',
      enterpriseApi: {
        apis: {
          core: { baseUrl: '<core_api_base_url>' },
          widgets: { baseUrl: '<widgets_api_base_url>' }
        },
        authentication: {
          clientId: '<client_id>',
          clientSecret: '<client_secret>'
        }
      },
      label: 'Enterprise',
      users: {
        'gb-1': {
          accounts: {
            GBP: '<gbp_account_id>'
          },
          fiatAsset: 'GBP',
          id: '<user_id>',
          label: 'GB #1'
        }
      }
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
        'apple-pay-authorize': {
          // Body for the create quote request used in the `authorize` flow with an Apple Pay origin.
          // The widget fetches the payment sheet of the quote by itself.
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
              method: 'apple-pay',
              type: 'apm'
            }
          }
        },
        authorize: {
          // Body for the create quote request used in `authorize` flow. (Optional when flow is not `authorize`)
          // Can be a static body or a function receiving the selected user.
          createQuoteBody: user => ({
            denomination: {
              amount: '10',
              asset: user.fiatAsset,
              target: 'origin'
            },
            destination: {
              id: user.accounts[user.fiatAsset],
              type: 'account'
            },
            origin: {
              id: '<external_account_id>',
              type: 'external_account'
            }
          })
        },
        'google-pay-authorize': {
          // Body for the create quote request used in the `authorize` flow with a Google Pay origin.
          // The widget fetches the payment sheet of the quote by itself.
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
              method: 'google-pay',
              type: 'apm'
            }
          }
        },
        'order-authorize-deposit-apple-pay': {
          // Body for the create order quote request used in the `order:authorize-deposit` flow, with an Apple Pay origin.
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
              method: 'apple-pay',
              type: 'apm'
            },
            type: 'on-ramp'
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
        'order-authorize-deposit-google-pay': {
          // Body for the create order quote request used in the `order:authorize-deposit` flow, with a Google Pay origin.
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
              method: 'google-pay',
              type: 'apm'
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
