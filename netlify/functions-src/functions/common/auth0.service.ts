import axios from 'axios'
import Config from '../config'

export class Auth0Service {
  private readonly auth0Domain = Config.auth0.backend.DOMAIN
  private readonly clientId = Config.auth0.backend.CLIENT_ID
  private readonly clientSecret = Config.auth0.backend.CLIENT_SECRET
  private readonly audience = Config.auth0.backend.AUDIENCE

  async getAdminAccessToken(): Promise<any> {
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

  async getUserProfile(accessToken: string, userId: string): Promise<any> {
    const response = await axios.get(`https://${this.auth0Domain}/api/v2/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    return response.data
  }

  async deleteUser(accessToken: string, userId: string): Promise<void> {
    await axios.delete(`https://${this.auth0Domain}/api/v2/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
  }
}
