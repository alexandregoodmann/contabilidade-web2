import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ChartType } from 'angular-google-charts';
import { ExtratoService } from 'src/app/services/extrato.service';

@Component({
  selector: 'app-analise-limites',
  templateUrl: './analise-limites.component.html',
  styleUrls: ['./analise-limites.component.scss']
})
export class AnaliseLimitesComponent implements OnInit {

  constructor(
    private extratoService: ExtratoService
  ) { }

  ngOnInit(): void {
    this.graficoBarra.datasource = this.extratoService.datasourceGraficoLimite;
  }

  graficoBarra = {
    columnNames: ['Categoria', 'Valor', 'Limite'],
    type: ChartType.BarChart,
    datasource: [['2014', 1000, 400]],
    title: 'Limite de Gastos',
    options: {
      legend: { position: "none" },
      chart: {
        subtitle: 'Sales, Expenses, and Profit: 2014-2017',
      },
      bars: 'horizontal' // Required for Material Bar Charts.
    }
  };
}
