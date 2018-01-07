import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'phone'})
export class PhonePipe implements PipeTransform {
  transform(value: string, args: string[]) {
    if (!value) {
      return value;
    }

    const s2 = ('' + value).replace(/\D/g, '');
    const m = s2.match(/^(\d{3})(\d{3})(\d{4})$/);
    return (!m) ? null : m[1] + '-' + m[2] + '-' + m[3];
  }
}
