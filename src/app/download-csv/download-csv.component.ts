import {Component, Input, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {DataSource} from '@angular/cdk/collections';
import {TalaDatasource} from '../tala.datasource';

@Component({
  selector: 'app-download-csv',
  templateUrl: './download-csv.component.html',
  styleUrls: ['./download-csv.component.css']
})
export class DownloadCsvComponent implements OnInit {
  @Input() displayedColumns: string[];
  @Input() headers: any;
  @Input() dataSource: TalaDatasource;
  @Input() fileName: string;

  constructor(private datePipe: DatePipe) { }

  ngOnInit() {
  }

  download(): void {
    console.log('Download csv');
    console.log('Columns', this.displayedColumns);
    console.log('dataSource', this.dataSource.getSortedData());

    const data = this.dataSource.getSortedData();

    let headerColumns = '';

    this.displayedColumns.forEach(column => {
      if ('action' !== column) {
        headerColumns += this.headers[column] || column;
        headerColumns += ',';
      }
    });
    headerColumns += '\n';

    let content = '';
    data.forEach(row => {
      content += this.getRowText(row);
    });

    const now = new Date();
    const dateSuffix = this.datePipe.transform(now.getTime(), 'dd-MMM-yy HH.mm')

    this.filedownload(`${this.fileName} ${dateSuffix}.csv`, `${headerColumns}${content}`);

  }

  getRowText(row: any): string {
    let rowContent = '';
    this.displayedColumns.forEach(column => {
      if ('action' !== column) {
        rowContent += row[column];
        rowContent += ',';
      }
    });
    rowContent += '\n'
    return rowContent;
  }

  filedownload(filename: string, csvData: string): void {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvData));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }
}
