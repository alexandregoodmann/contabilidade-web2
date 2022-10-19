import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { ChartType } from 'angular-google-charts';
import { AnaliseDTO } from 'src/app/models/analiseDTO';
import { ChartDefinition } from 'src/app/models/ChartDefinition';
import { Planilha } from 'src/app/models/planilha';
import { AnaliseService } from 'src/app/services/analise.service';
import { PlanilhaService } from 'src/app/services/planilha.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-analise',
  templateUrl: './analise.component.html',
  styleUrls: ['./analise.component.scss']
})
export class AnaliseComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSort) sort!: MatSort;

  colunas: string[] = ['data', 'banco', 'categoria', 'descricao', 'fixo', 'valor'];
  tableDatasource!: AnaliseDTO[];
  datasource!: AnaliseDTO[];
  pie!: ChartDefinition;
  bar!: ChartDefinition;
  barGastoFixo!: ChartDefinition;
  line!: ChartDefinition;
  area!: ChartDefinition;
  chartDatasource!: any[];
  saldoAtual!: number;
  totalGastos!: number;
  gastosFixo!: number;

  constructor(
    private analiseService: AnaliseService,
    private planilhaService: PlanilhaService,
    private utilService: UtilService
  ) { }

  ngOnInit(): void {
    this.planilhaService.planilhaSelecionada.subscribe(data => {
      const planilha: Planilha = data as Planilha;
      this.analiseService.getAnaliseAnoMes(planilha.ano, planilha.mes).subscribe(data => {

        this.datasource = data as AnaliseDTO[];
        this.tableDatasource = data as AnaliseDTO[];

        //constroi graficos
        this.buildChartDatasource();
        this.pieChart();
        this.barChart();
        this.barGastoFixoChart();
        this.lineChart();
        this.areaChart();

        //calcula saldo atual
        this.saldoAtual = 0;
        this.datasource.filter(o => o.tipo != 'CARTAO').map(n => n.valor).forEach(valor => { this.saldoAtual = this.saldoAtual + valor });

        //calcula total de gastos
        this.totalGastos = 0;
        this.datasource.filter(o => o.valor < 0 && o.tipo != 'CARTAO').map(n => n.valor).forEach(valor => { this.totalGastos = this.totalGastos + valor })
        this.totalGastos = this.totalGastos * (-1);
      });
    });
  }

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe((sort) => {
      this.tableDatasource = this.utilService.sortCollection(sort, this.tableDatasource);
    });
  }

  private buildChartDatasource() {
    this.chartDatasource = [];
    const analisar = this.datasource.filter(o => o.analisar);
    this.chartDatasource = Array.from(this.analiseService.agruparCategoria(analisar));
  }

  private barChart() {
    this.bar = new ChartDefinition();
    this.bar.type = ChartType.BarChart;
    this.bar.columns = ['Categoria', 'Total'];
    this.bar.datasource = this.chartDatasource;
    this.bar.options = {
      title: 'Gastos por categoria',
      width: 375,
      height: 300,
      bar: { groupWidth: "70%" },
      legend: { position: "none" },
    };
  }

  private barGastoFixoChart() {
    this.barGastoFixo = new ChartDefinition();
    this.barGastoFixo.type = ChartType.BarChart;
    this.barGastoFixo.columns = ['Categoria', 'Total'];

    const fixos = this.datasource.filter(o => o.analisar && o.fixo);
    const grupo = this.analiseService.agruparCategoria(fixos)

    this.gastosFixo = 0;
    grupo.forEach(e => {
      this.gastosFixo = this.gastosFixo + (e[1] as number);
    });

    this.barGastoFixo.datasource = grupo;

    this.barGastoFixo.options = {
      title: 'Gastos fixos',
      width: 375,
      height: 300,
      bar: { groupWidth: "70%" },
      legend: { position: "none" },
    };
  }

  private pieChart() {
    this.pie = new ChartDefinition();
    this.pie.type = ChartType.PieChart;
    this.pie.width = 550;
    this.pie.height = 300;
    this.pie.columns = ['Categoria', 'Total'];
    this.pie.datasource = this.chartDatasource;
    this.pie.options = {
      is3D: true,
      pieSliceText: 'none',
      legend: {
        position: 'labeled',
        maxLines: 1
      }
    };
  }

  private lineChart() {
    this.line = new ChartDefinition();
    this.line.type = ChartType.Line;
    this.line.columns = ['Day', 'Guardians of the Galaxy', 'The Avengers', 'Transformers: Age of Extinction'];
    this.line.datasource = [
      [1, 37.8, 80.8, 41.8],
      [2, 30.9, 69.5, 32.4],
      [3, 25.4, 57, 25.7],
      [4, 11.7, 18.8, 10.5],
      [5, 11.9, 17.6, 10.4],
      [6, 8.8, 13.6, 7.7],
      [7, 7.6, 12.3, 9.6],
      [8, 12.3, 29.2, 10.6],
      [9, 16.9, 42.9, 14.8],
      [10, 12.8, 30.9, 11.6],
      [11, 5.3, 7.9, 4.7],
      [12, 6.6, 8.4, 5.2],
      [13, 4.8, 6.3, 3.6],
      [14, 4.2, 6.2, 3.4]
    ]
    this.line.options = {
      chart: {
        title: 'Box Office Earnings in First Two Weeks of Opening',
        subtitle: 'in millions of dollars (USD)'
      },
      width: 700,
      height: 400
    };
  }

  private areaChart() {
    this.area = new ChartDefinition();
    this.area.type = ChartType.AreaChart;
    this.area.columns = ['Year', 'Sales', 'Expenses'];
    this.area.datasource = [
      ['2013', 1000, 400],
      ['2014', 1170, 460],
      ['2015', 660, 1120],
      ['2016', 1030, 540]
    ]
    this.area.options = {
      title: 'Company Performance',
      hAxis: { title: 'Year', titleTextStyle: { color: '#333' } },
      vAxis: { minValue: 0 },
      width: 600,
      height: 280

    };
  }

  onSelectCategoria(e: any) {
    const i = e.selection[0].row;
    const categoria = this.bar.datasource[i][0];
    this.tableDatasource = this.datasource;
    this.tableDatasource = this.tableDatasource.filter(o => o.categoria == categoria);
  }

}