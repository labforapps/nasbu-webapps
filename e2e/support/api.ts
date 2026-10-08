import { APIRequestContext, request } from '@playwright/test';
import { config, credentials, Role } from './env';

/**
 * Cliente de la API de nasbu-core para preparar y limpiar datos de prueba.
 *
 * Se autentica igual que el front: id token de Cognito (USER_PASSWORD_AUTH) como Bearer.
 * Todas las consultas llevan `?subscription=<uuid>`, como hace la app.
 * Con E2E_API_TOKEN se salta Cognito (útil contra un backend local o de mocks).
 */
export class Api {
  private constructor(
    private readonly http: APIRequestContext,
    readonly subscriptionId: string,
    readonly user: any
  ) {}

  static async as(role: Role): Promise<Api> {
    const token = process.env.E2E_API_TOKEN || (await idToken(role));
    const http = await request.newContext({
      baseURL: config.apiURL.replace(/\/?$/, '/'),
      extraHTTPHeaders: { Authorization: `Bearer ${token}` },
    });
    const me = await http.get('security/me/');
    if (!me.ok()) {
      throw new Error(`GET security/me/ respondió ${me.status()} para ${role}`);
    }
    const user = await me.json();
    const subscriptionId = user?.subscriptions?.[0]?.subscription?.uuid;
    if (!subscriptionId) {
      throw new Error(`El usuario de ${role} no tiene suscripción`);
    }
    return new Api(http, subscriptionId, user);
  }

  async get<T = any>(path: string, params: Record<string, string> = {}): Promise<T> {
    const res = await this.http.get(path, { params: { subscription: this.subscriptionId, ...params } });
    return this.json<T>(res, 'GET', path);
  }

  async post<T = any>(path: string, body: any): Promise<T> {
    const res = await this.http.post(path, {
      params: { subscription: this.subscriptionId },
      data: { subscription: this.subscriptionId, ...body },
    });
    return this.json<T>(res, 'POST', path);
  }

  /** Borra sin fallar si el registro ya no existe: lo usan las limpiezas. */
  async remove(path: string): Promise<void> {
    const res = await this.http.delete(path, { params: { subscription: this.subscriptionId } });
    if (!res.ok() && res.status() !== 404) {
      console.warn(`DELETE ${path} respondió ${res.status()}`);
    }
  }

  async dispose(): Promise<void> {
    await this.http.dispose();
  }

  private async json<T>(res: Awaited<ReturnType<APIRequestContext['get']>>, method: string, path: string): Promise<T> {
    if (!res.ok()) {
      throw new Error(`${method} ${path} respondió ${res.status()}: ${(await res.text()).slice(0, 300)}`);
    }
    return (await res.json()) as T;
  }
}

async function idToken(role: Role): Promise<string> {
  const creds = credentials(role);
  if (!creds) {
    throw new Error(`Faltan las credenciales de ${role}`);
  }
  const res = await fetch(`https://cognito-idp.${config.cognitoRegion}.amazonaws.com/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-amz-json-1.1',
      'X-Amz-Target': 'AWSCognitoIdentityProviderService.InitiateAuth',
    },
    body: JSON.stringify({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: config.cognitoClientId,
      AuthParameters: { USERNAME: creds.username, PASSWORD: creds.password },
    }),
  });
  const body: any = await res.json();
  const token = body?.AuthenticationResult?.IdToken;
  if (!token) {
    throw new Error(`Cognito no devolvió token para ${role}: ${body?.message || body?.__type || res.status}`);
  }
  return token;
}
