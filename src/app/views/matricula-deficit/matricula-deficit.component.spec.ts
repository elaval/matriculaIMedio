import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatriculaDeficitComponent } from './matricula-deficit.component';

describe('MatriculaDeficitComponent', () => {
  let component: MatriculaDeficitComponent;
  let fixture: ComponentFixture<MatriculaDeficitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatriculaDeficitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatriculaDeficitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
