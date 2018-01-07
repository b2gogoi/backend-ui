import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'language'})
export class LanguagePipe implements PipeTransform {

  transform(value: string, args: string[]): any {
    const langMap = {
      'hi': 'Hindi',
      'en': 'English',
      'ma': 'Marathi'
    };

    if (!value) {
      return value;
    }

    return langMap[value] || value;
  }
}
