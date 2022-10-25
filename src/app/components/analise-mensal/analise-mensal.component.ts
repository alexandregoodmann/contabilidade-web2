import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { ChartType } from 'angular-google-charts';
import { AnaliseDTO } from 'src/app/models/analiseDTO';
import { ChartDefinition } from 'src/app/models/ChartDefinition';
import { LancamentoDTO } from 'src/app/models/extrato';
import { AnaliseService } from 'src/app/services/analise.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-analise-mensal',
  templateUrl: './analise-mensal.component.html',
  styleUrls: ['./analise-mensal.component.scss']
})
export class AnaliseMensalComponent implements OnInit, AfterViewInit {

  @Input() datasource!: AnaliseDTO[];
  @ViewChild(MatSort) sort!: MatSort;

  colunas: string[] = ['data', 'banco', 'categoria', 'descricao', 'fixo', 'valor', 'limpar'];
  tableDatasource!: AnaliseDTO[];
  pie!: ChartDefinition;
  bar!: ChartDefinition;
  barGastoFixo!: ChartDefinition;
  chartDatasource!: any[];
  saldoAtual!: number;
  totalGastos!: number;
  gastosFixo!: number;

  constructor(
    private analiseService: AnaliseService,
    private utilService: UtilService,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.tableDatasource = this.datasource;

    //constroi graficos
    this.buildChartDatasource();
    this.pieChart();
    this.barChart();
    this.barGastoFixoChart();

    //calcula saldo atual
    this.saldoAtual = 0;
    this.saldoAtual = this.datasource.filter(o => o.tipo != 'CARTAO').map(n => n.valor).reduce((a, b) => { return a + b });

    //calcula total de gastos
    this.totalGastos = 0;
    this.totalGastos = this.datasource.filter(o => o.valor < 0 && o.tipo != 'CARTAO').map(n => n.valor).reduce((a, b) => { return a + b }) * (-1);

    //calcula gasto fixo
    this.gastosFixo = 0;
    this.gastosFixo = this.datasource.filter(o => o.fixo && o.valor < 0).map(n => n.valor).reduce((a, b) => { return a + b }) * (-1);
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
      width: 350,
      height: 250,
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

    this.barGastoFixo.datasource = grupo;
    this.barGastoFixo.options = {
      title: 'Gastos fixos',
      width: 350,
      height: 250,
      bar: { groupWidth: "70%" },
      legend: { position: "none" },
    };
  }

  private pieChart() {
    this.pie = new ChartDefinition();
    this.pie.type = ChartType.PieChart;
    this.pie.width = 700;
    this.pie.height = 350;
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

  onSelectCategoria(e: any) {
    const i = e.selection[0].row;
    const categoria = this.bar.datasource[i][0];
    this.tableDatasource = this.datasource;
    this.tableDatasource = this.tableDatasource.filter(o => o.categoria == categoria);
  }

  editar(row: LancamentoDTO) {
    this.router.navigate(['/lancamento'], { queryParams: { idLancamento: row.idLancamento } });
  }

}