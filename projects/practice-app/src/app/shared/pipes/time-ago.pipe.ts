import { Pipe, PipeTransform } from '@angular/core';
import { formatDistanceToNow } from 'date-fns';
import { enUS, es, fr, de } from 'date-fns/locale';

@Pipe({
  name: 'timeAgo'
})
export class TimeAgoPipe implements PipeTransform {

  transform(value: Date | string | number, locale: string = 'en'): string {
    if (!value) return '';

    const date = typeof value === 'string' || typeof value === 'number' ? new Date(value) : value;

    // Selección de idioma
    const locales: { [key: string]: Locale } = { en: enUS, es, fr, de };
    const selectedLocale = locales[locale] || enUS;

    // Calcula el tiempo relativo
    return formatDistanceToNow(date, { addSuffix: true, locale: selectedLocale });
  }

}
