import nPath from 'path';
import UrlPattern from 'url-pattern';
import { error } from '../utils/response';
import type { ApiHandler } from '../types';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
export type Routes = [pattern: `/${string}`, HttpMethod, ApiHandler][];

export const withRouter = (routes: Routes): ApiHandler => {
  return async (event, context) => {
    try {
      // event.path = /api/mentorships/:userId/requests
      const [,,,...innerSegments] = event.path.split(nPath.sep);
      // path = /:userId/requests
      const path = `/${innerSegments.join('/')}`;

      const route = routes.find(([pattern]) => {
        const urlPattern = new UrlPattern(pattern);
        return urlPattern.match(path);
      });

      if (!route) {
        return error(`Route '${event.path}' not found`, 404);
      }

      const [pattern, HttpMethod, handler] = route;

      if (event.httpMethod !== HttpMethod) {
        return error('Method not allowed', 405);
      }

      const params = new UrlPattern(pattern).match(path);
      return await handler({ ...event, queryStringParameters: params }, context);
    } catch (e) {
      console.error(e);
      return error(`Internal server error: ${e.message}`, 500);
    }
  };
}