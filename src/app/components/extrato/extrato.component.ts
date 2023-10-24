import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { Lancamento } from 'src/app/models/lancamento';
import { Planilha } from 'src/app/models/planilha';
import { ExtratoService } from 'src/app/services/extrato.service';
import { LancamentoService } from 'src/app/services/lancamento.service';
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

  constructor(
    private lancamentoService: LancamentoService,
    private extratoService: ExtratoService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.extratoService.updateDatasource();
    this.extratoService.setExtrato();
    this.extratoService.extrato.subscribe(data => { this.extrato = data; });
    this.contas = [... new Set(this.extrato.map(l => l.conta.descricao))].sort();
  }

  update(acao: string, item: Lancamento) {
    if (acao == 'fixo') {
      item.fixo = (item.fixo == null || item.fixo == 'false') ? 'true' : 'false';
    } else if (acao == 'concluido') {
      item.concluido = !item.concluido;
    }
    this.lancamentoService.update(item).subscribe();
  }

  filtrarPorConta(conta: String) {
    let data = [... new Set(this.extratoService.datasource.filter(l => l.conta.descricao == conta))].sort();
    this.extratoService.datasourceBehavior.next(data);
  }

  filtrarSemLabels() {
    this.extratoService.filtrarExtratoPorCategoria(undefined);
  }

  sortData(sort: Sort) {
    this.extrato = this.extrato.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'data':
          return compare(a.data, b.data, isAsc);
        case 'conta':
          return compare(a.conta.descricao, b.conta.descricao, isAsc);
        case 'lancamento':
          return compare(a.descricao, b.descricao, isAsc);
        case 'fixo':
          return compare(a.fixo, b.fixo, isAsc);
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
