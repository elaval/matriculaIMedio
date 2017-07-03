import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetMigracionIntracomunalComponent } from './widget-migracion-intracomunal.component';

describe('WidgetMigracionIntracomunalComponent', () => {
  let component: WidgetMigracionIntracomunalComponent;
  let fixture: ComponentFixture<WidgetMigracionIntracomunalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetMigracionIntracomunalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetMigracionIntracomunalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
