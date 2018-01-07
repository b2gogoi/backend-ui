import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export class TalaDatabase {
  /** Stream that emits whenever the data has been modified. */
  dataChange: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  get data(): any[] { return this.dataChange.value; }

  constructor(rows: any[]) {
    this.dataChange.next(rows);
  }
}
