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
    }
  },
  paymentWidgetSession: {
    // URL to override the response url from the payment widget session.
    // required when you want to test the payment widget locally.
    // Uncomment the line below to override the payment widget session's url
    // to point to the local payment widget.
    // urlOverride: 'http://localhost:8788'
  }
};
