import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { ChartType } from 'angular-google-charts';
import { saveAs } from 'file-saver';
import { ChartDefinition } from 'src/app/models/ChartDefinition';
import { AnaliseDTO } from 'src/app/models/analiseDTO';
import { TipoConta } from 'src/app/models/conta';
import { LimiteGastos } from 'src/app/models/limitegastos';
import { Planilha } from 'src/app/models/planilha';
import { AnaliseService } from 'src/app/services/analise.service';
import { LimitegastosService } from 'src/app/services/limitegastos.service';
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
  limites!: LimiteGastos[];
  planilhaSelecionada!: Planilha;

  constructor(
    private planilhaService: PlanilhaService,
    private analiseService: AnaliseService,
    private utilService: UtilService,
    private limiteService: LimitegastosService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.planilhaService.planilhaSelecionada.subscribe(planilha => {

      this.planilhaSelecionada = planilha;

      this.limiteService.findAll().subscribe(data => {
        this.limites = data.filter(o => o.planilha.ano == planilha.ano && o.planilha.mes == planilha.mes);
      });

      this.analiseService.getAnaliseAnoMes(planilha.ano, planilha.mes).subscribe(data => {
        this.datasource = data;
        this.tableDatasource = this.datasource;
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
    const categorias = [...new Set(totais.map(o => o[0]).concat(fixos.map(o => o[0])))]

    this.bar.columns = ['', 'Limite', 'Total', 'Fixo'];
    this.bar.datasource = [];
    categorias.forEach(categoria => {
      const t = totais.filter(o => o[0] == categoria);
      const f = fixos.filter(o => o[0] == categoria);
      const limite = this.limites.find(o => o.categoria.descricao == categoria)?.limite;
      const linha = [categoria, (limite == undefined) ? 0 : limite, t.length > 0 ? t[0][1] : 0, f.length > 0 ? f[0][1] : 0];
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
    this.router.navigate(['/lancamento'], { queryParams: { backto: '/analise', idLancamento: row.idLancamento } });
  }

  filtrarFixo(item: string) {
    this.tableDatasource = this.datasource;
    switch (item) {
      case 'entrada':
        this.tableDatasource = this.datasource.filter(o => o.valor > 0);
        break;
      case 'saida':
        this.tableDatasource = this.datasource.filter(o => o.valor < 0);
        break;
      case 'saidaFixa':
        this.tableDatasource = this.datasource.filter(o => o.valor < 0 && o.fixo);
        break;
      case 'saidaNaoFixa':
        this.tableDatasource = this.datasource.filter(o => o.valor < 0 && !o.fixo);
        break;
    }
  }

  calculaResumo() {
    this.resumo = new ResumoAnalise();
    this.resumo.entrada = this.datasource.filter(o => o.valor > 0).map(n => n.valor).reduce((a, b) => a + b);
    this.resumo.saida = this.datasource.filter(o => o.valor < 0 && o.tipoConta == TipoConta.CC).map(n => n.valor).reduce((a, b) => a + b);
    this.resumo.saldo = this.resumo.entrada + this.resumo.saida;
    this.resumo.saidaFixa = this.datasource.filter(o => o.valor < 0 && o.fixo).map(n => n.valor).reduce((a, b) => a + b);
    this.resumo.saidaNaoFixa = this.datasource.filter(o => o.valor < 0 && !o.fixo).map(n => n.valor).reduce((a, b) => a + b);
  }

  downloadExtrato(): void {
    let fileName = 'extrato-' + this.planilhaSelecionada.ano + '-' + this.planilhaSelecionada.mes + '.cvs'
    this.analiseService
      .downloadExtrato(this.planilhaSelecionada.ano, this.planilhaSelecionada.mes)
      .subscribe(blob => saveAs(blob, fileName));
  }

  processar() {
    this.planilhaService.processar().subscribe();
  }
}

export class ResumoAnalise {
  mes: number = 0;
  entrada: number = 0;
  saida: number = 0;
  saldo: number = 0;
  saidaFixa: number = 0;
  saidaNaoFixa: number = 0;
}