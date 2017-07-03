import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetMigracionIntercomunalComponent } from './widget-migracion-intercomunal.component';

describe('WidgetMigracionIntercomunalComponent', () => {
  let component: WidgetMigracionIntercomunalComponent;
  let fixture: ComponentFixture<WidgetMigracionIntercomunalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetMigracionIntercomunalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetMigracionIntercomunalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
