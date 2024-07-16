import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepresentacionesComponent } from './representaciones.component';

describe('RepresentacionesComponent', () => {
  let component: RepresentacionesComponent;
  let fixture: ComponentFixture<RepresentacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepresentacionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RepresentacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
