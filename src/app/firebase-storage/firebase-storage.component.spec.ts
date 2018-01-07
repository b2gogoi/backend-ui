import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FirebaseStorageComponent } from './firebase-storage.component';

describe('FirebaseStorageComponent', () => {
  let component: FirebaseStorageComponent;
  let fixture: ComponentFixture<FirebaseStorageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FirebaseStorageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirebaseStorageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
