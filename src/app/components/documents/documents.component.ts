import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material';
import {Http, Response} from '@angular/http';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent implements OnInit {
  @Input() document: any;
  @Input() driverId: string;
  documentForm: FormGroup;
  fileName: string;
  file: File;

  constructor(public snackBar: MatSnackBar, private http: Http, private fb: FormBuilder) {
    this.documentForm = fb.group({
      'docNo': ['', [Validators.required]],
      'docExpiry': ['', [Validators.required]],
      'docFile': ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.document.doc = this.document.doc || {};
  }

  fileChange(event): void {
    console.log(event);

    const fileList: FileList = event.target.files;

    if (fileList.length > 0) {
      this.file = fileList[0];
      this.fileName = this.file.name;
      console.log(`filename set to : ${this.fileName}`);
    }

  }

  clear(): void {
    this.fileName = null;
    this.file = null;
    // this.fileUploaded = false;
  }

  upload(type, driverId): void {

    console.log('Uploading file : ' + this.file.name);
    console.log('Uploading file type : ' + type);

    const formData: FormData = new FormData();
    formData.append('upload', this.file, this.file.name);
    formData.append('driverId', driverId);
    formData.append('docNo', this.document.doc['doc_id']);
    formData.append('docExpiry', this.document.doc['doc_expiry']);

    const headers = new Headers();
    headers.append('Accept', 'application/json');

    this.http.post(`/server/file-upload/type/${type}?`, formData)
      .map((response: Response) => {
        return (<any>response.json());
      }).subscribe(
      data => {
        console.log(data);
        this.document.uploaded = true;
        this.openSnackBar(this.document.message + ' uploaded', null, 2000);
        this.clear();
      },

      error => this.openSnackBar(error.errorMessage, null, 2000)

    );

  }

  openSnackBar(message: string, action: string, duration: number) {
    const snackRef = this.snackBar.open(message, action, {
      duration: duration
    });
  }

}
