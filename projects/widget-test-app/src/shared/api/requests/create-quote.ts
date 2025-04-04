/**
 * Exports.
 */

export type CreateQuoteOptions = {
  accessToken: string;
  impersonateUserId?: string;
};

export type CreateQuoteData = {
  origin: {
    type: 'account' | 'external-account';
    id: string;
  };
  destination: {
    type: 'account' | 'external-account';
    id: string;
  };
  denomination: {
    asset: string;
    amount: string;
    target: 'origin' | 'destination';
  };
};

export const createQuote = async (createQuoteData: CreateQuoteData, options: CreateQuoteOptions) => {
  const response = await fetch(`${import.meta.env.VITE_ENTERPRISE_CORE_API_BASE_URL}/transactions/quote`, {
    body: JSON.stringify({
      ...createQuoteData
    }),
    headers: {
      Authorization: `Bearer ${options.accessToken}`,
      'Content-Type': 'application/json',
      'X-On-Behalf-Of': `user ${options.impersonateUserId}`
    },
    method: 'POST'
  });

  if (response.ok) {
    const responseBody = await response.json();

    const { quote } = responseBody;

    return quote;
  }

  throw new Error(
    `Request to create quote failed. HTTP status code: ${response.status}, text: ${await response.text()}`
  );
};
