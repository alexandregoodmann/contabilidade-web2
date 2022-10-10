import { formatCurrency } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChartType, Row } from 'angular-google-charts';
import { AnalisePlanilha, ChartDefinition } from 'src/app/models/analiseplanilha';
import { Categoria } from 'src/app/models/categoria';
import { Extrato, LancamentoDTO } from 'src/app/models/extrato';
import { Lancamento } from 'src/app/models/lancamento';
import { Planilha } from 'src/app/models/planilha';
import { CategoriaService } from 'src/app/services/categoria.service';
import { LancamentoService } from 'src/app/services/lancamento.service';
import { PlanilhaService } from 'src/app/services/planilha.service';

@Component({
  selector: 'app-extrato',
  templateUrl: './extrato.component.html',
  styleUrls: ['./extrato.component.scss']
})
export class ExtratoComponent implements OnInit {

  displayedColumns: string[] = ['acao', 'data', 'categoria', 'descricao', 'valor', 'concluido'];
  extrato!: Extrato[];
  order: number = 1;
  saldoPrevisto: number = 0;
  saldoAtual: number = 0;
  planilhaSelecionada!: Planilha;
  marcados: LancamentoDTO[] = [];
  categorias!: Categoria[];
  expandidos: Map<number, boolean> = new Map<number, boolean>();
  piedatasource: Row[] = [];
  graficoSaldos!: ChartDefinition;

  constructor(
    private planilhaService: PlanilhaService,
    private lancamentoService: LancamentoService,
    private categoriaService: CategoriaService,
    private router: Router
  ) { }

  ngOnInit() {
    this.planilhaService.planilhaSelecionada.subscribe(planilha => {
      this.planilhaSelecionada = planilha;
      this.findExtrato();
      this.buildPieDataSource();
    });
    this.categoriaService.findAll().subscribe(data => { this.categorias = data });
  }

  private buildPieDataSource() {
    this.piedatasource = [];
    this.planilhaService.getAnalisePlanilha(this.planilhaSelecionada.id).subscribe(data => {
      let analise = data as AnalisePlanilha[];

      const total = analise.reduce((t, o) => {
        return t + o.valor
      }, 0);

      analise.forEach(a => {
        let label: string = a.descricao + ': ' + formatCurrency(a.valor, 'pt-BR', 'R$');
        let valor: number = ((a.valor / total) * 100);
        this.piedatasource.push([label, valor]);
      });
    });
  }

  private findExtrato() {
    this.planilhaService.getExtrato(this.planilhaSelecionada.id).subscribe(data => {
      this.extrato = data as Extrato[];
      this.saldoPrevisto = 0;
      this.saldoAtual = 0;
      this.extrato.forEach(conta => {
        this.saldoPrevisto = this.saldoPrevisto + conta.saldoPrevisto;
        this.saldoAtual = this.saldoAtual + conta.saldoEfetivado;
      });
      this.buildGraficoSaldos();
    });
  }

  editar(idLancamento: number) {
    this.router.navigate(['/lancamento'], { queryParams: { idLancamento: idLancamento } });
  }

  sortBy(indexConta: number, lancamentos: LancamentoDTO[], coluna: string) {
    let ret = this.order;
    lancamentos.sort(function (x: any, y: any) {
      x[coluna] = (x[coluna] == null) ? '' : x[coluna];
      y[coluna] = (y[coluna] == null) ? '' : y[coluna];
      if (x[coluna] > y[coluna]) {
        return ret;
      }
      if (x[coluna] < y[coluna]) {
        return ret * (-1);
      }
      return 0;
    });
    this.extrato[indexConta].lancamentos = Array.from(lancamentos);
    this.order = this.order * (-1);
  }

  marcar(event: any, item: LancamentoDTO) {
    if (event.checked) {
      item.marcado = true;
      this.marcados.push(item);
    } else {
      item.marcado = false;
      let i = this.marcados.indexOf(item);
      this.marcados.splice(i, 1);
    }
  }

  marcarTodos(event: any, lancamentos: LancamentoDTO[]) {
    this.marcados = [];
    if (event.checked) {
      lancamentos.forEach(l => { l.marcado = true });
      this.marcados = lancamentos;
    } else {
      lancamentos.forEach(l => { l.marcado = false });
    }
  }

  concluirMarcados() {
    this.lancamentoService.concluir(this.marcados.map(n => n.id)).subscribe(() => { }, () => { }, () => {
      this.marcados = [];
      this.findExtrato();
    });
  }

  deleteAll() {
    this.lancamentoService.deleteAll(this.marcados.map(n => n.id)).subscribe(() => { }, () => { }, () => {
      this.marcados = [];
      this.findExtrato();
    });
  }

  categorizar(categoria: Categoria) {
    this.lancamentoService.categorizar(this.marcados.map(n => n.id), categoria).subscribe(() => { }, () => { }, () => {
      this.marcados = [];
      this.findExtrato();
    });
  }

  isExpanded(id: number) {
    return this.expandidos.get(id);
  }

  expand(conta: Extrato) {
    if (this.expandidos.has(conta.id)) {
      let e = this.expandidos.get(conta.id);
      this.expandidos.set(conta.id, !e);
    } else {
      this.expandidos.set(conta.id, true);
    }
  }

  buildGraficoSaldos() {

    let entradas = 0;
    let gastos = 0;
    this.extrato?.forEach(e => {
      e.lancamentos.forEach(l => {
        if (l.valor > 0 && l.categoria != 'Saldo Anterior' && l.concluido) {
          entradas = entradas + l.valor;
        } else if (l.valor < 0 && l.concluido && l.analisar) {
          gastos = gastos + l.valor
        }
      });
    });

    this.graficoSaldos = new ChartDefinition();
    this.graficoSaldos.type = ChartType.Bar;
    this.graficoSaldos.datasource = [
      ["Entradas", entradas],
      ["Gastos", gastos * (-1)]
    ];
    this.graficoSaldos.options = {
      width: 500,
      height: 100,
      legend: { position: 'none' },
      bars: 'horizontal',
      bar: { groupWidth: "90%" }
    };
  }
}
