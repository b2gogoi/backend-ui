import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalControlsComponent } from './approval-controls.component';

describe('ApprovalControlsComponent', () => {
  let component: ApprovalControlsComponent;
  let fixture: ComponentFixture<ApprovalControlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovalControlsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovalControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
