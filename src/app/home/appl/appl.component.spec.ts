import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplComponent } from './appl.component';

describe('ApplComponent', () => {
  let component: ApplComponent;
  let fixture: ComponentFixture<ApplComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
