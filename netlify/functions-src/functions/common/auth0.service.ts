import axios, { type AxiosResponse } from 'axios'
import Config from '../config'

class Auth0Service {
  private readonly auth0Domain = Config.auth0.backend.DOMAIN
  private readonly clientId = Config.auth0.backend.CLIENT_ID
  private readonly clientSecret = Config.auth0.backend.CLIENT_SECRET
  private readonly audience = Config.auth0.backend.AUDIENCE

  async getAdminAccessToken(): Promise<AxiosResponse<{ access_token: string }>['data']> {
    try {
      const response = await axios.post(`https://${this.auth0Domain}/oauth/token`, {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        audience: this.audience,
        grant_type: 'client_credentials',
      })
      return response.data
    } catch (error) {
      console.error('getAdminAccessToken, Error:', error)
      throw new Error('Error getting access token')
    }
  }

  async getUserProfile(auth0Id: string): Promise<AxiosResponse<{ email: string, nickname: string, picture: string }>['data']> {
    try {
      const { access_token } = await this.getAdminAccessToken();
      const response = await axios.get(`https://${this.auth0Domain}/api/v2/users/${auth0Id}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      return response.data
    } catch (error) {
      console.error('getUserProfile, Error:', error)
      throw new Error('Error getting user profile')
    }
  }

  async deleteUser(accessToken: string, userId: string): Promise<void> {
    await axios.delete(`https://${this.auth0Domain}/api/v2/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
  }

  async createVerificationEmailTicket(
    auth0UserId: string,
  ) {
    try {
      const { access_token: accessToken } = await this.getAdminAccessToken();
      const [provider, userId] = auth0UserId.split('|');
      const payload = {
        result_url: Config.urls.CLIENT_BASE_URL,
        user_id: auth0UserId,
        identity: { user_id: userId, provider },
      };

      const response = await axios.post(
        `https://${Config.auth0.backend.DOMAIN}/api/v2/tickets/email-verification`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'content-type': 'application/json',
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error('createVerificationEmailTicket, Error:', error)
      throw error;
    }
  }
}

export const auth0Service = new Auth0Service();