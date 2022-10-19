import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { ChartType } from 'angular-google-charts';
import { AnaliseDTO } from 'src/app/models/analiseDTO';
import { ChartDefinition } from 'src/app/models/ChartDefinition';
import { AnaliseService } from 'src/app/services/analise.service';
import { PlanilhaService } from 'src/app/services/planilha.service';
import { UtilService } from 'src/app/services/util.service';
import { Constants } from 'src/app/shared/Constants';

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
  datasourceMes!: AnaliseDTO[];
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

    this.planilhaService.planilhaSelecionada.subscribe(planilha => {
      this.analiseService.getAnaliseAno(planilha.ano).subscribe(data => {

        this.datasource = data;
        this.datasourceMes = data.filter(o => o.mes == planilha.mes);
        this.tableDatasource = this.datasourceMes;

        //constroi graficos
        this.buildChartDatasource();
        this.pieChart();
        this.barChart();
        this.barGastoFixoChart();
        this.lineChart();
        this.areaChart();

        //calcula saldo atual
        this.saldoAtual = 0;
        this.datasourceMes.filter(o => o.tipo != 'CARTAO').map(n => n.valor).forEach(valor => { this.saldoAtual = this.saldoAtual + valor });

        //calcula total de gastos
        this.totalGastos = 0;
        this.datasourceMes.filter(o => o.valor < 0 && o.tipo != 'CARTAO').map(n => n.valor).forEach(valor => { this.totalGastos = this.totalGastos + valor })
        this.totalGastos = this.totalGastos * (-1);

        //calcula gasto fixo
        this.gastosFixo = 0;
        this.datasourceMes.filter(o => o.valor < 0 && o.tipo != 'CARTAO' && o.fixo).map(n => n.valor).forEach(valor => { this.gastosFixo = this.gastosFixo + valor })
        this.gastosFixo = this.gastosFixo * (-1);
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
    const analisar = this.datasourceMes.filter(o => o.analisar);
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
      height: 300,
      bar: { groupWidth: "70%" },
      legend: { position: "none" },
    };
  }

  private barGastoFixoChart() {

    this.barGastoFixo = new ChartDefinition();
    this.barGastoFixo.type = ChartType.BarChart;
    this.barGastoFixo.columns = ['Categoria', 'Total'];

    const fixos = this.datasourceMes.filter(o => o.analisar && o.fixo);
    const grupo = this.analiseService.agruparCategoria(fixos)

    this.barGastoFixo.datasource = grupo;
    this.barGastoFixo.options = {
      title: 'Gastos fixos',
      width: 350,
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

    let matriz: number[][] = [];
    const analisar = this.datasource.filter(o => o.analisar);
    const categorias = [...new Set(analisar.map(n => n.categoria))];
    const meses = [...new Set(analisar.map(n => n.mes))];

    meses.forEach(mes => {
      let linha: any[] = [];
      linha.push(Constants.mesesAbreviados[mes - 1]);
      categorias.forEach(categoria => {
        let soma = 0;
        analisar.filter(o => o.mes == mes && o.categoria == categoria).forEach(lancamento => {
          soma = soma + lancamento.valor;
        });
        linha.push(soma * (-1));
      });
      matriz.push(linha);
    });

    this.line = new ChartDefinition();
    this.line.type = ChartType.Line;
    this.line.columns = [''].concat(categorias);
    this.line.datasource = matriz.reverse();
    this.line.options = {
      legend: {
        position: 'left'
      },
      chart: {
        title: 'Projeção de categorias',
      },
      width: 500,
      height: 250
    };
  }

  private somar(valores: number[]): number {
    let total = 0;
    valores.forEach(v => {
      total = total + v;
    });
    if (total < 0)
      total = total * (-1);
    return total;
  }

  private areaChart() {
    let matriz: number[][] = [];
    const lancamentos = this.datasource.filter(o => o.tipo != 'CARTAO');
    const meses = [...new Set(lancamentos.map(n => n.planilha))];
    meses.forEach(mes => {
      let linha: any[] = [mes, 0, 0, 0];
      const lancamentosMes = lancamentos.filter(o => o.planilha == mes);
      //saldo
      linha[1] = this.somar(lancamentosMes.map(n => n.valor));
      //gasto
      linha[2] = this.somar(lancamentosMes.filter(o => o.valor < 0).map(n => n.valor));
      //fixo
      linha[3] = this.somar(lancamentosMes.filter(o => o.valor < 0 && o.fixo == true).map(n => n.valor));
      matriz.push(linha);
    });

    this.area = new ChartDefinition();
    this.area.type = ChartType.AreaChart;
    this.area.columns = ['', 'Saldo', 'Gastos', 'Fixos'];
    this.area.datasource = matriz;
    this.area.options = {
      title: 'Projeção de Rendimentos',
      vAxis: { minValue: 0 },
      width: 700,
      height: 500,
      legend: {
        position: 'top'
      }
    };
  }

  onSelectCategoria(e: any) {
    const i = e.selection[0].row;
    const categoria = this.bar.datasource[i][0];
    this.tableDatasource = this.datasourceMes;
    this.tableDatasource = this.tableDatasource.filter(o => o.categoria == categoria);
  }

}