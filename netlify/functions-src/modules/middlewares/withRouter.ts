import nPath from 'path';
import UrlPattern from 'url-pattern';
import { error } from '../../utils/response';
import type { Handler } from '@netlify/functions';

export type Routes = [pattern: string, Handler][];

export const withRouter = (router: [pattern: string, Handler][]): Handler => {
  return async (event, context) => {
    try {
      // event.path = /api/<module>/...
      const [,,,...innerSegments] = event.path.split(nPath.sep);
      const path = innerSegments.join('/');
      const route = router.find(([pattern]) => {
        const urlPattern = new UrlPattern(pattern);
        return urlPattern.match(path);
      });

      if (!route) {
        return error('Not found', 404);
      }

      const [pattern, handler] = route;
      const params = new UrlPattern(pattern).match(path);
      return await handler({ ...event, queryStringParameters: params }, context);
    } catch (error) {
      return error(`Internal server error: ${error.message}`, 500);
    }
  };
}