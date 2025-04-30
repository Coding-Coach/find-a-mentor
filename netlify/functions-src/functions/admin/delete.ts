import Config from '../config';

const auth0Domain = Config.auth0.backend.DOMAIN;

const getAdminAccessToken = async (): Promise<string> => {
  try {

    const response = await fetch(`https://${auth0Domain}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: Config.auth0.backend.CLIENT_ID,
        client_secret: Config.auth0.backend.CLIENT_SECRET,
        audience: Config.auth0.backend.AUDIENCE,
        grant_type: 'client_credentials',
      }),
    });
    const data = await response.json();
    return data.access_token;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching admin access token:', error);
    throw new Error('Failed to fetch access token');
  }
};


export const deleteUser = async (userId: string): Promise<void> => {
  const accessToken = await getAdminAccessToken();
  if (!accessToken) {
    throw new Error('Failed to get access token');
  }

  const response = await fetch(`https://${auth0Domain}/api/v2/users/${userId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete user: ${response.statusText}`);
  }

  return response.json();
}