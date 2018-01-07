import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoansDueComponent } from './loans-due.component';

describe('LoansDueComponent', () => {
  let component: LoansDueComponent;
  let fixture: ComponentFixture<LoansDueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoansDueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoansDueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
