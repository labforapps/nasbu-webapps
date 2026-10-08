import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

/**
 * Cuentas de prueba del inventario (INVENTARIO.md, sección 2).
 * Las credenciales llegan por variables de entorno: E2E_<CLAVE>_USER y E2E_<CLAVE>_PASSWORD,
 * por ejemplo E2E_OWNER_ULTIMATE_USER. Nunca se escriben en el repositorio.
 */
export const ROLES = {
  ownerUltimate: 'OWNER_ULTIMATE',
  ownerStarter: 'OWNER_STARTER',
  ownerLimite: 'OWNER_LIMITE',
  colabEscritura: 'COLAB_ESCRITURA',
  colabLectura: 'COLAB_LECTURA',
  colabSinExpediente: 'COLAB_SIN_EXPEDIENTE',
  suscripcionImpaga: 'SUSCRIPCION_IMPAGA',
  suscripcionSuspendida: 'SUSCRIPCION_SUSPENDIDA',
} as const;

export type Role = keyof typeof ROLES;

export interface Credentials {
  username: string;
  password: string;
}

export function credentials(role: Role): Credentials | null {
  const key = ROLES[role];
  const username = process.env[`E2E_${key}_USER`];
  const password = process.env[`E2E_${key}_PASSWORD`];
  return username && password ? { username, password } : null;
}

export function hasRole(role: Role): boolean {
  return credentials(role) !== null;
}

/** Archivo de sesión (storageState) que guarda tests/auth.setup.ts para cada rol. */
export function authFile(role: Role): string {
  return path.resolve(__dirname, '..', '.auth', `${role}.json`);
}

export function hasSession(role: Role): boolean {
  return fs.existsSync(authFile(role));
}

export const config = {
  baseURL: process.env.E2E_BASE_URL || 'https://dev.nasbulegal.com',
  apiURL: process.env.E2E_API_URL || 'https://apidev.nasbulegal.com/api',
  cognitoRegion: process.env.E2E_COGNITO_REGION || 'us-east-1',
  // Id del cliente público de Cognito de QA (environment.qa.ts). No es un secreto.
  cognitoClientId: process.env.E2E_COGNITO_CLIENT_ID || 'hmcbmhlorp86sjmmu3d5qbp7f',
  // Expediente privado compartido con todos menos colabSinExpediente (NAS-038, NAS-079).
  privateCaseFileId: process.env.E2E_PRIVATE_CASE_FILE_ID || '',
};
