import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currency'
})
export class CurrencyPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!value || isNaN(value)) {
      return 'N/A';
    }

    const s2 = ('' + parseInt(value, 10)).replace(/\D/g, '');
    const m = s2.match(/^(\d{3})(\d{3})$/);
    // return (!m) ? null : m[1] + ',' + m[2];

    value = parseInt(value, 10);

    if (999 < value ) {
      const end = (value % 1000) + 1000;
      // end = '' + end;
      value = Math.floor(value / 1000) + ',' + ('' + end).substr(1);
    }

    return '$ ' + value;
  }

}
