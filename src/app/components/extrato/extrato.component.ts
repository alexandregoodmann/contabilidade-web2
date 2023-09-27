import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChartType } from 'angular-google-charts';
import { TipoConta } from 'src/app/models/conta';
import { ExtratoDTO } from 'src/app/models/extrato';
import { Label } from 'src/app/models/label';
import { Lancamento } from 'src/app/models/lancamento';
import { Planilha } from 'src/app/models/planilha';
import { LabelService } from 'src/app/services/label.service';
import { LancamentoService } from 'src/app/services/lancamento.service';
import { PlanilhaService } from 'src/app/services/planilha.service';

@Component({
  selector: 'app-extrato',
  templateUrl: './extrato.component.html',
  styleUrls: ['./extrato.component.scss']
})
export class ExtratoComponent implements OnInit {

  displayedColumns: string[] = ['acao', 'data', 'descricao', 'fixo', 'valor', 'concluido'];
  extrato!: ExtratoDTO[];
  saldoPrevisto: number = 0;
  saldoAtual: number = 0;
  planilhaSelecionada!: Planilha;
  marcados: number[] = [];
  labels!: Label[];
  expandidos: Map<number, boolean> = new Map<number, boolean>();
  ordem: OrdemExtrato = new OrdemExtrato();

  constructor(
    private planilhaService: PlanilhaService,
    private lancamentoService: LancamentoService,
    private labelService: LabelService,
    private router: Router
  ) { }

  ngOnInit() {
    this.planilhaService.planilhaSelecionada.subscribe(planilha => {
      this.planilhaSelecionada = planilha;
      this.findExtrato();
    });
    this.labelService.findAll().subscribe(data => { this.labels = data });
  }

  private findExtrato() {
    this.planilhaService.getExtrato(this.planilhaSelecionada.id).subscribe(data => {
      this.extrato = data;
      this.saldoAtual = this.extrato.filter(o => o.tipo == TipoConta.CC).map(n => n.saldoEfetivado).reduce((a, b) => a + b);
      this.saldoPrevisto = this.extrato.filter(o => o.tipo == TipoConta.CC).map(n => n.saldoPrevisto).reduce((a, b) => a + b);
    });
  }

  editar(idLancamento: number) {
    if (idLancamento > 0)
      this.router.navigate(['/lancamento'], { queryParams: { backto: '/extrato', idLancamento: idLancamento } });
    else
      this.router.navigate(['/lancamento']);
  }

  sortBy(indexConta: number, lancamentos: Lancamento[], coluna: string, update?: boolean) {
    let ret = this.ordem.sort;
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
    this.ordem.sort = this.ordem.sort * (-1);
  }

  marcar(event: any, item: Lancamento) {
    if (event.checked) {
      item.marcado = true;
      this.marcados.push(item.id);
    } else {
      item.marcado = false;
      let i = this.marcados.indexOf(item.id);
      this.marcados.splice(i, 1);
    }
  }

  marcarTodos(event: any, lancamentos: Lancamento[]) {
    this.marcados = [];
    if (event.checked) {
      lancamentos.forEach(l => { l.marcado = true });
      this.marcados = lancamentos.map(n => n.id);
    } else {
      lancamentos.forEach(l => { l.marcado = false });
    }
  }

  concluirMarcados() {
    this.lancamentoService.concluir(this.marcados).subscribe(() => { }, () => { }, () => {
      this.marcados = [];
      this.findExtrato();
    });
  }

  marcarFixo() {
    this.lancamentoService.fixo(this.marcados).subscribe(() => { }, () => { }, () => {
      this.marcados = [];
      this.findExtrato();
    });
  }

  deleteAll() {
    this.lancamentoService.deleteAll(this.marcados).subscribe(() => { }, () => { }, () => {
      this.marcados = [];
      this.findExtrato();
    });
  }

  categorizar(label: Label) {
    this.lancamentoService.categorizar(this.marcados, label).subscribe(() => { }, () => { }, () => {
      this.marcados = [];
      this.findExtrato();
    });
  }

  isExpanded(id: number) {
    return this.expandidos.get(id);
  }

  expand(conta: ExtratoDTO) {
    if (this.expandidos.has(conta.id)) {
      let e = this.expandidos.get(conta.id);
      this.expandidos.set(conta.id, !e);
    } else {
      this.expandidos.set(conta.id, true);
    }
  }

}

export class OrdemExtrato {
  sort: number = 1;
  indexConta?: number;
  lancamentos?: Lancamento[];
  coluna?: string;
}