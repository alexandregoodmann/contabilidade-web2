import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { Lancamento } from 'src/app/models/lancamento';
import { Planilha } from 'src/app/models/planilha';
import { ExtratoService } from 'src/app/services/extrato.service';
import { LancamentoService } from 'src/app/services/lancamento.service';
import { PlanilhaService } from 'src/app/services/planilha.service';
import { LancamentoDialogComponent } from '../lancamento-dialog/lancamento-dialog.component';

@Component({
  selector: 'app-extrato',
  templateUrl: './extrato.component.html',
  styleUrls: ['./extrato.component.scss']
})
export class ExtratoComponent implements OnInit {

  displayedColumns: string[] = ['data', 'descricao', 'valor', 'fixo', 'concluido'];
  extrato: Lancamento[] = [];
  saldoPrevisto: number = 0;
  saldoAtual: number = 0;
  planilhaSelecionada!: Planilha;
  contas: String[] = [];
  lastSort!: Sort;

  constructor(
    private lancamentoService: LancamentoService,
    private extratoService: ExtratoService,
    private dialog: MatDialog,
    private planilhaService: PlanilhaService
  ) { }

  ngOnInit() {

    this.planilhaService.planilhaSelecionada.subscribe(planilha => {
      this.planilhaService.getLancamentos(planilha.id).subscribe(lancamentos => {
        this.extrato = lancamentos;
        this.calcularTotais(this.extrato);
        this.extratoService.datasource = lancamentos;
        this.contas = [... new Set(lancamentos.map(l => l.conta.descricao))].sort();
      });
    });

    this.extratoService.extrato.subscribe(data => {
      this.extrato = data;
      this.calcularTotais(data);
      this.sortData(this.lastSort);
    });

  }

  update(acao: string, item: Lancamento) {
    if (acao == 'fixo') {
      item.fixo = (item.fixo == null || item.fixo == 'false') ? 'true' : 'false';
    } else if (acao == 'concluido') {
      item.concluido = !item.concluido;
    }
    this.lancamentoService.update(item).subscribe(() => {
      this.calcularTotais(this.extrato);
    });
  }

  filtrarPorConta(e: any) {
    let data = [... new Set(this.extratoService.datasource.filter(l => l.conta.descricao == e.value))];
    this.calcularTotais(data);
    this.extratoService.datasourceBehavior.next(data);
  }

  filtrarSemLabels() {
    this.extratoService.filtrarExtratoPorCategoria(undefined);
  }

  filtrarDescricao(e: any) {
    let descricao = e.target.value.toLowerCase();
    console.log(descricao);

    let data = [... new Set(this.extratoService.datasource.filter(l => l.descricao.toLowerCase().includes(descricao)))];
    this.calcularTotais(data);
    this.extratoService.datasourceBehavior.next(data);
  }

  calcularTotais(lancamentos: Lancamento[]) {
    this.saldoAtual = 0;
    this.saldoPrevisto = 0
    if (lancamentos.length > 1) {
      this.saldoPrevisto = lancamentos.map(o => o.valor).reduce((a, b) => (a + b));
      this.saldoAtual = lancamentos.filter(o => o.concluido).map(o => o.valor).reduce((a, b) => (a + b));
    }
  }

  sortData(sort: Sort) {
    this.lastSort = sort;
    this.extrato = this.extrato.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'data':
          return compare(a.data, b.data, isAsc);
        case 'conta':
          return compare(a.conta.descricao, b.conta.descricao, isAsc);
        case 'lancamento':
          return compare(a.descricao.toLowerCase(), b.descricao.toLowerCase(), isAsc);
        case 'fixo':
          return compare((a.fixo != null ? true : false), (b.fixo != null ? true : false), isAsc);
        case 'valor':
          return compare(a.valor, b.valor, isAsc);
        case 'concluido':
          return compare(a.concluido, b.concluido, isAsc);
        default:
          return 0;
      }
    });
  }

  openLancamento(idLancamento: number) {
    const dialogRef = this.dialog.open(LancamentoDialogComponent, {
      data: {
        idLancamento: idLancamento,
      },
    });
  }
}

export function compare(a: number | string | Date | boolean, b: number | string | Date | boolean, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
