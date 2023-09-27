import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtratoGraficosComponent } from './extrato-graficos.component';

describe('ExtratoGraficosComponent', () => {
  let component: ExtratoGraficosComponent;
  let fixture: ComponentFixture<ExtratoGraficosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtratoGraficosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExtratoGraficosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
