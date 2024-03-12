import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaldoDiarioComponent } from './saldo-diario.component';

describe('SaldoDiarioComponent', () => {
  let component: SaldoDiarioComponent;
  let fixture: ComponentFixture<SaldoDiarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaldoDiarioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaldoDiarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
