import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaldocontasComponent } from './saldocontas.component';

describe('SaldocontasComponent', () => {
  let component: SaldocontasComponent;
  let fixture: ComponentFixture<SaldocontasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaldocontasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaldocontasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
