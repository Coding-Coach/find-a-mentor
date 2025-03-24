import nPath from 'path';
import UrlPattern from 'url-pattern';
import { error } from '../utils/response';
import type { ApiHandler, HttpMethod } from '../types';
import { DataError } from '../data/errors';

type Route = [pattern: string, HttpMethod, ApiHandler];
export type Routes = Route[];

const findRouteByPath = (routes: Routes, path: string, httpMethod: string) => {
  const matchedRoutes = routes.filter(([pattern]) => {
    const urlPattern = new UrlPattern(pattern);
    return urlPattern.match(path);
  });

  switch (matchedRoutes.length) {
    case 0:
      throw new DataError(404, `Route '${path}' not found`);
    case 1:
      return matchedRoutes[0];
    default:
      const route = matchedRoutes.find(([, HttpMethod]) => HttpMethod === httpMethod);
      if (!route) {
        throw new DataError(405, 'Method not allowed');
      }
      return route;
  }
}

const getRouteData = (route: Route, path: string) => {
  const [pattern, , handler] = route;
  const params = new UrlPattern(pattern).match(path);

  return { params, handler };
}

const getAppPath = (eventPath: string) => {
  // event.path = /api/mentorships/:userId/requests
  const [,,,...innerSegments] = eventPath.split(nPath.sep);
  return `/${innerSegments.join('/')}`;
}

export const withRouter = (routes: Routes): ApiHandler => {
  return async (event, context) => {
    try {
      const path = getAppPath(event.path);
      const route = findRouteByPath(routes, path, event.httpMethod);

      const { handler, params } = getRouteData(route, path);

      if (['POST', 'PUT'].includes(event.httpMethod) && event.body) {
        try {
          event.parsedBody = JSON.parse(event.body);
        } catch (e) {
          return error('Invalid JSON', 400);
        }
      }

      return await handler({ ...event, queryStringParameters: params }, context);
    } catch (e) {
      console.error(e);
      if (e instanceof DataError) {
        return error(e.message, e.statusCode);
      }
      return error(`Internal server error: ${e.message}`, 500);
    }
  };
}