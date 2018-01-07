import { MatPaginator, MatSort } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { TalaDatabase } from './tala.database';

import { Observable } from 'rxjs/Observable';

/**
 * Data source to provide what data should be rendered in the table. The observable provided
 * in connect should emit exactly the data that should be rendered by the table. If the data is
 * altered, the observable should emit that new set of data on the stream. In our case here,
 * we return a stream that contains only one set of data that doesn't change.
 */
export class TalaDatasource extends DataSource<any> {
  constructor(private _rows: TalaDatabase,
              private _paginator: MatPaginator,
              private _sort: MatSort,
              private getActiveColumnForSorting) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<any[]> {
    const displayDataChanges = [
      this._rows.dataChange,
      this._paginator.page,
      this._sort.sortChange
    ];

    // return Observable.of(data);
    return Observable.merge(...displayDataChanges).map(() => {
      const sortFirst = this.getSortedData();
      const data = sortFirst.slice();

      const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
      return data.splice(startIndex, this._paginator.pageSize);
    });
  }

  disconnect() {}

  /** Returns a sorted copy of the database data. */
  getSortedData(): any[] {
    const data = this._rows.data.slice();
    if (!this._sort.active || this._sort.direction === '') { return data; }

    return data.sort((a, b) => {
      let propertyA: number|string = '';
      let propertyB: number|string = '';

      [propertyA, propertyB] = this.getActiveColumnForSorting(this._sort.active, a, b);

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      const sortValue = valueA < valueB ? -1 : 1;

      return sortValue * (this._sort.direction === 'asc' ? 1 : -1);
    });
  }

}
