import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-firebase-storage',
  templateUrl: './firebase-storage.component.html',
  styleUrls: ['./firebase-storage.component.css']
})
export class FirebaseStorageComponent implements OnInit {
  user: Observable<firebase.User>;
  items: FirebaseListObservable<any[]>;
  msgVal = '';

  constructor(public afAuth: AngularFireAuth, public af: AngularFireDatabase) {
    this.items = af.list('/', {
      query: {
        limitToLast: 50
      }
    });

    this.user = this.afAuth.authState;
  }

  ngOnInit() {
    console.log(firebase);
  }

}
