import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolSystemViewComponent } from './school-system-view.component';

describe('SchoolSystemViewComponent', () => {
  let component: SchoolSystemViewComponent;
  let fixture: ComponentFixture<SchoolSystemViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchoolSystemViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchoolSystemViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
