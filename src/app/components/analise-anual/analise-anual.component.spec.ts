import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnaliseAnualComponent } from './analise-anual.component';

describe('AnaliseAnualComponent', () => {
  let component: AnaliseAnualComponent;
  let fixture: ComponentFixture<AnaliseAnualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnaliseAnualComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnaliseAnualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
