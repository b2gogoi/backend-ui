import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'vehicle'})
export class VehiclePipe implements PipeTransform {
  transform(value: string, args: string[]) {
    if (!value) {
      return value;
    }

    const map = {
      'V1': 'Economy',
      'V2': 'Comfort',
      'V3': 'Black'
    };

    return map[value];
  }
}
