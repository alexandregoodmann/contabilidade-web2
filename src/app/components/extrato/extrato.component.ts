import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { Lancamento } from 'src/app/models/lancamento';
import { Planilha } from 'src/app/models/planilha';
import { AnaliseService } from 'src/app/services/analise.service';
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
  lancamentos: Lancamento[] = [];
  saldoPrevisto: number = 0;
  saldoAtual: number = 0;
  planilhaSelecionada!: Planilha;
  contas: String[] = [];

  constructor(
    private lancamentoService: LancamentoService,
    private analiseService: AnaliseService,
    private planilhaService: PlanilhaService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.planilhaService.planilhaSelecionada.subscribe(data => { this.planilhaSelecionada = data; });
    this.analiseService.getExtrato(true);
    this.analiseService.extratoObservable.subscribe(data => {
      this.lancamentos = data;
      this.contas = [...new Set<String>(this.lancamentos.map(o => o.conta.descricao))].sort();
      console.log(this.lancamentos);

    });
  }

  update(acao: string, item: Lancamento) {
    if (acao == 'fixo') {
      item.fixo = (item.fixo == null || item.fixo == 'false') ? 'true' : 'false';
    } else if (acao == 'concluido') {
      item.concluido = !item.concluido;
    }
    this.lancamentoService.update(item).subscribe();
  }

  processarLabels(conta: any) {
    let obj = { idPlanilha: this.planilhaSelecionada.id, idConta: conta.id };
    this.lancamentoService.processarLabels(obj).subscribe(() => {
      this.analiseService.getExtrato(true);
    });
  }

  filtrarPorConta(conta: String) {
    this.analiseService.getExtrato(true);
    this.lancamentos = this.lancamentos.filter(l => l.conta.descricao == conta);
  }

  filtrarSemLabels() {
    this.analiseService.filtrarExtratoPorCategoria(undefined);
  }

  sortData(sort: Sort) {
    this.lancamentos = this.lancamentos.sort((a, b) => {
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
