import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetComunaComponent } from './widget-comuna.component';

describe('WidgetComunaComponent', () => {
  let component: WidgetComunaComponent;
  let fixture: ComponentFixture<WidgetComunaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetComunaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetComunaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
