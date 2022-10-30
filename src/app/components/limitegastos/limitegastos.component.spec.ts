import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LimitegastosComponent } from './limitegastos.component';

describe('LimitegastosComponent', () => {
  let component: LimitegastosComponent;
  let fixture: ComponentFixture<LimitegastosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LimitegastosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LimitegastosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
