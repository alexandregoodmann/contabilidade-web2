import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { Lancamento } from 'src/app/models/lancamento';
import { Planilha } from 'src/app/models/planilha';
import { AnaliseService } from 'src/app/services/analise.service';
import { LancamentoService } from 'src/app/services/lancamento.service';
import { PlanilhaService } from 'src/app/services/planilha.service';

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

  constructor(
    private lancamentoService: LancamentoService,
    private router: Router,
    private analiseService: AnaliseService,
    private planilhaService: PlanilhaService
  ) { }

  ngOnInit() {
    this.planilhaService.planilhaSelecionada.subscribe(data => { this.planilhaSelecionada = data; });
    this.analiseService.getExtrato(true);
    this.analiseService.extratoObservable.subscribe(data => {
      console.log('lancamentos', data);

      this.lancamentos = data;
    });
  }

  editar(idLancamento: number) {
    if (idLancamento > 0)
      this.router.navigate(['/lancamento'], { queryParams: { backto: '/extrato', idLancamento: idLancamento } });
    else
      this.router.navigate(['/lancamento']);
  }

  update(acao: string, item: Lancamento) {
    if (acao == 'fixo') {
      item.fixo = (item.fixo == null || item.fixo == 'false') ? 'true' : 'false';
    } else if (acao == 'concluido') {
      item.concluido = !item.concluido;
    }
    this.lancamentoService.update(item).subscribe(data => {
      console.log(data);
    });
  }

  processarLabels(conta: any) {
    let obj = { idPlanilha: this.planilhaSelecionada.id, idConta: conta.id };
    this.lancamentoService.processarLabels(obj).subscribe(() => {
      this.analiseService.getExtrato(true);
    });
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
}

export function compare(a: number | string | Date | boolean, b: number | string | Date | boolean, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
