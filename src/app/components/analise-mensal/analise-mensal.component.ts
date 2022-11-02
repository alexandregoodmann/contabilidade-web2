import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { ChartType } from 'angular-google-charts';
import { AnaliseDTO } from 'src/app/models/analiseDTO';
import { ChartDefinition } from 'src/app/models/ChartDefinition';
import { AnaliseService } from 'src/app/services/analise.service';
import { PlanilhaService } from 'src/app/services/planilha.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-analise-mensal',
  templateUrl: './analise-mensal.component.html',
  styleUrls: ['./analise-mensal.component.scss']
})
export class AnaliseMensalComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSort) sort!: MatSort;

  colunas: string[] = ['data', 'banco', 'categoria', 'descricao', 'fixo', 'valor', 'limpar'];
  datasource!: AnaliseDTO[];
  tableDatasource!: AnaliseDTO[];
  pie!: ChartDefinition;
  bar!: ChartDefinition;
  barGastoFixo!: ChartDefinition;
  resumo!: ResumoAnalise;

  constructor(
    private planilhaService: PlanilhaService,
    private analiseService: AnaliseService,
    private utilService: UtilService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.planilhaService.planilhaSelecionada.subscribe(planilha => {
      this.analiseService.getAnaliseAnoMes(planilha.ano, planilha.mes).subscribe(data => {

        //datasources
        this.datasource = data;
        this.tableDatasource = this.datasource;

        //constroi graficos
        this.pieChart();
        this.barChart();

        this.calculaResumo();
      });
    });

  }

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe((sort) => {
      this.tableDatasource = this.utilService.sortCollection(sort, this.tableDatasource);
    });
  }

  private barChart() {
    this.bar = new ChartDefinition();
    this.bar.type = ChartType.ColumnChart;

    const totais = Array.from(this.analiseService.agruparCategoria(this.datasource.filter(o => o.analisar)));
    const fixos = Array.from(this.analiseService.agruparCategoria(this.datasource.filter(o => o.fixo && o.valor < 0)));
    const labels = [...new Set(totais.map(o => o[0]).concat(fixos.map(o => o[0])))]

    this.bar.columns = ['Categoria', 'Total', 'Fixo'];
    this.bar.datasource = [];
    labels.forEach(l => {
      const t = totais.filter(o => o[0] == l);
      const f = fixos.filter(o => o[0] == l);
      const linha = [l, t.length > 0 ? t[0][1] : 0, f.length > 0 ? f[0][1] : 0];
      this.bar.datasource.push(linha);
    });

    this.bar.options = {
      width: 800,
      height: 300,
      bar: { groupWidth: "60%" },
      legend: { position: "top" },
    };
  }

  private pieChart() {
    this.pie = new ChartDefinition();
    this.pie.type = ChartType.PieChart;
    this.pie.width = 700;
    this.pie.height = 350;
    this.pie.columns = ['Categoria', 'Total'];

    this.pie.datasource = Array.from(this.analiseService.agruparCategoria(this.datasource.filter(o => o.analisar)));

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

  editar(row: AnaliseDTO) {
    this.router.navigate(['/lancamento'], { queryParams: { backto: '/analisemensal', idLancamento: row.idLancamento } });
  }

  filtrarFixo(fixo: boolean) {
    this.tableDatasource = this.datasource;
    if (fixo)
      this.tableDatasource = this.tableDatasource.filter(o => o.fixo == true);
    else
      this.tableDatasource = this.tableDatasource.filter(o => o.fixo != true);
  }

  calculaResumo() {
    this.resumo = new ResumoAnalise();
    this.datasource.forEach(item => {
      this.resumo.entrada = (item.valor > 0) ? this.resumo.entrada + item.valor : this.resumo.entrada;
      this.resumo.saida = (item.valor < 0 && item.categoria != 'Cartão') ? this.resumo.saida + item.valor : this.resumo.saida;
      this.resumo.entradaFixa = (item.fixo && item.valor > 0) ? this.resumo.entradaFixa + item.valor : this.resumo.entradaFixa;
      this.resumo.saidaFixa = (item.fixo && item.valor < 0) ? this.resumo.saidaFixa + item.valor : this.resumo.saidaFixa;
    });
    this.resumo.saldo = this.resumo.entrada + this.resumo.saida;
    this.resumo.saidaNaoFixa = this.resumo.saida - this.resumo.saidaFixa;
  }

}

export class ResumoAnalise {
  entrada: number = 0;
  saida: number = 0;
  saldo: number = 0;
  entradaFixa: number = 0;
  saidaFixa: number = 0;
  saidaNaoFixa: number = 0;
}