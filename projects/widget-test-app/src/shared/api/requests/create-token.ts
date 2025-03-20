/**
 * Exports.
 */

export type CreateTokenData = {
  clientId: string;
  clientSecret: string;
};

export const createToken = async ({ clientId, clientSecret }: CreateTokenData) => {
  const credentials = btoa(`${clientId}:${clientSecret}`);

  const response = await fetch(`${import.meta.env.VITE_ENTERPRISE_CORE_API_BASE_URL}/oauth2/token`, {
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      scope: '*'
    }).toString(),
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    method: 'POST'
  });

  if (response.ok) {
    const data = await response.json();

    return data;
  }

  throw new Error(
    `Request to create token failed. HTTP status code: ${response.status}, text: ${await response.text()}`
  );
};
