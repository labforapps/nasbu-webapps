import * as fs from 'fs';
import * as path from 'path';

/**
 * Textos de la app tomados de su propio archivo de traducciones (español, el idioma activo).
 * Así una prueba busca "el botón de crear cliente" por su clave y no se rompe si cambia la redacción.
 */
const ES_PATH = path.resolve(__dirname, '..', '..', 'projects', 'practice-app', 'src', 'assets', 'i18n', 'es.json');
const es = JSON.parse(fs.readFileSync(ES_PATH, 'utf8'));

export function t(key: string, params: Record<string, string | number> = {}): string {
  const value = key.split('.').reduce((node: any, part) => (node == null ? undefined : node[part]), es);
  if (typeof value !== 'string') {
    throw new Error(`Clave de traducción inexistente: ${key}`);
  }
  const text = Object.entries(params).reduce(
    (acc, [name, val]) => acc.replace(new RegExp(`{{\\s*${name}\\s*}}`, 'g'), String(val)),
    value
  );
  return text.replace(/<[^>]+>/g, '').trim();
}

/** Coincidencia exacta del texto, ignorando espacios alrededor. */
export function exact(key: string): RegExp {
  return new RegExp(`^\\s*${escape(t(key))}\\s*$`);
}

/** El texto aparece dentro de un contenido más largo (botones con íconos, por ejemplo). */
export function contains(key: string): RegExp {
  return new RegExp(escape(t(key)));
}

function escape(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
