import { AuthInterceptor } from './interceptor.service';

describe('AuthInterceptor.retryDelay (NAS-031)', () => {

  function outcome(status: number): 'retry' | 'error' {
    let result: 'retry' | 'error' = 'retry';
    AuthInterceptor.retryDelay({ status }).subscribe({ next: () => result = 'retry', error: () => result = 'error' });
    return result;
  }

  it('no reintenta respuestas 4xx', () => {
    [400, 401, 403, 404, 422].forEach(status => expect(outcome(status)).toBe('error'));
  });

  it('reintenta fallas de red y 5xx', () => {
    [0, 500, 502, 503].forEach(status => expect(outcome(status)).toBe('retry'));
  });
});
