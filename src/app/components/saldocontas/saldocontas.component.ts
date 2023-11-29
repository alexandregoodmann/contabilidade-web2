import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ChartType, GoogleChartComponent } from 'angular-google-charts';
import { ExtratoService } from 'src/app/services/extrato.service';
import { PlanilhaService } from 'src/app/services/planilha.service';

@Component({
  selector: 'app-saldocontas',
  templateUrl: './saldocontas.component.html',
  styleUrls: ['./saldocontas.component.scss']
})
export class SaldocontasComponent implements OnInit, AfterViewInit {

  @ViewChild(GoogleChartComponent) chart!: GoogleChartComponent;

  //grafico
  title = 'Saldo das Contas';
  type = ChartType.BarChart;
  datasource = [
    ['', 0, 0]
  ];
  columnNames = ['Conta', 'Saldo', { role: 'annotation' }];
  options = {
    bar: { groupWidth: "40%" },
    legend: { position: "none" }
  };

  constructor(
    private extratoService: ExtratoService,
    private planilhaService: PlanilhaService
  ) { }

  ngAfterViewInit(): void {
    //console.log('child', this.chart);
  }

  ngOnInit(): void {
    this.planilhaService.planilhaSelecionada.subscribe(planilha => {
      this.extratoService.getSaldoContas(planilha.ano, planilha.mes).subscribe(saldos => {
        this.datasource = [];
        saldos.forEach(d => {
          this.datasource.push([d.conta, d.saldo, d.saldo]);
        });
      });
    });
  }

}
