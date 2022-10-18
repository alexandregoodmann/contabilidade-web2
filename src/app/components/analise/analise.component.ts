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

  colunas: string[] = ['data', 'banco', 'categoria', 'descricao', 'valor'];
  datasource!: AnaliseDTO[];
  pie!: ChartDefinition;
  bar!: ChartDefinition;
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
        this.buildChartDatasource();
        this.buildPieChart();
        this.buildBarChart();
        this.calculaSaldoAtual();
      });
    });
  }

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe((sort) => {
      this.datasource = this.utilService.sortCollection(sort, this.datasource);
    });
  }

  private calculaSaldoAtual() {
    this.saldoAtual = 0;
    this.gastosFixo = 0;
    this.datasource.filter(o => o.tipo != 'CARTAO').map(n => n.valor).forEach(valor => { this.saldoAtual = this.saldoAtual + valor });
    this.datasource.filter(o => o.fixo && o.valor < 0).map(n => n.valor).forEach(valor => this.gastosFixo = this.gastosFixo + valor);
  }

  private buildChartDatasource() {

    this.chartDatasource = [];
    this.totalGastos = 0;

    const analisar = this.datasource.filter(o => o.analisar);
    let mapaCategorias = new Map<string, number>();
    [...new Set(analisar.map(n => n.categoria))].forEach(categoria => {
      let valor = 0;
      analisar.filter(o => o.categoria == categoria).forEach(obj => {
        valor = valor + obj.valor;
      });
      mapaCategorias.set(categoria, valor * (-1))
    });
    mapaCategorias.forEach((v, k) => {
      this.chartDatasource.push([k, v]);
      this.totalGastos = this.totalGastos + v;
    });
    const data = this.chartDatasource.sort(function (a, b) {
      if (a[1] > b[1])
        return -1;
      if (a[1] < b[1])
        return 1
      return 0;
    });
    this.chartDatasource = Array.from(data);
  }

  private buildPieChart() {
    this.pie = new ChartDefinition();
    this.pie.type = ChartType.PieChart;
    this.pie.width = 600;
    this.pie.height = 400;
    this.pie.columns = ['Categoria', 'Total'];
    this.pie.datasource = this.chartDatasource;
    this.pie.options = {
      title: 'Gastos por Categoria',
      is3D: true,
      pieHole: 0.5,
      pieSliceText: 'none',
      legend: {
        position: 'labeled',
        maxLines: 3
      }
    };
  }

  private buildBarChart() {
    this.bar = new ChartDefinition();
    this.bar.type = ChartType.BarChart;
    this.bar.columns = ['Categoria', 'Total'];
    this.bar.datasource = this.chartDatasource;
    this.bar.options = {
      title: 'Gastos por Categoria',
      width: 600,
      height: 400,
      bar: { groupWidth: "70%" },
      legend: { position: "none" },
    };
  }

}