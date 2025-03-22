import nPath from 'path';
import UrlPattern from 'url-pattern';
import { error } from '../../utils/response';
import type { Handler } from '@netlify/functions';
import type { ApiHandler } from '../../types';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
export type Routes = [pattern: string, HttpMethod, ApiHandler][];

export const withRouter = (routes: Routes): ApiHandler => {
  return async (event, context) => {
    try {
      // event.path = /api/<module>/...
      const [,,,...innerSegments] = event.path.split(nPath.sep);
      const path = innerSegments.join('/');
      const route = routes.find(([pattern]) => {
        const urlPattern = new UrlPattern(pattern);
        return urlPattern.match(path);
      });

      if (!route) {
        return error('Not found', 404);
      }

      const [pattern, HttpMethod, handler] = route;

      if (event.httpMethod !== HttpMethod) {
        return error('Method not allowed', 405);
      }

      const params = new UrlPattern(pattern).match(path);
      return await handler({ ...event, queryStringParameters: params }, context);
    } catch (error) {
      return error(`Internal server error: ${error.message}`, 500);
    }
  };
}