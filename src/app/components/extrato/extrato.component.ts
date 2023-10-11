import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TipoConta } from 'src/app/models/conta';
import { ExtratoDTO } from 'src/app/models/extrato';
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
  extrato: ExtratoDTO[] = [];
  saldoPrevisto: number = 0;
  saldoAtual: number = 0;
  planilhaSelecionada!: Planilha;
  expandidos: Map<number, boolean> = new Map<number, boolean>();
  ordem: OrdemExtrato = new OrdemExtrato();

  constructor(
    private lancamentoService: LancamentoService,
    private router: Router,
    private analiseService: AnaliseService,
    private planilhaService: PlanilhaService
  ) { }

  ngOnInit() {

    this.planilhaService.planilhaSelecionada.subscribe(data => { this.planilhaSelecionada = data });

    this.analiseService.getExtrato(true);
    this.analiseService.extratoObservable.subscribe(data => {
      this.extrato = data;
      if (this.extrato.length > 0) {
        this.saldoAtual = this.extrato.filter(o => o.tipo == TipoConta.CC).map(n => n.saldoEfetivado).reduce((a, b) => a + b);
        this.saldoPrevisto = this.extrato.filter(o => o.tipo == TipoConta.CC).map(n => n.saldoPrevisto).reduce((a, b) => a + b);
      }
    });

  }

  editar(idLancamento: number) {
    if (idLancamento > 0)
      this.router.navigate(['/lancamento'], { queryParams: { backto: '/extrato', idLancamento: idLancamento } });
    else
      this.router.navigate(['/lancamento']);
  }

  sortBy(indexConta: number, lancamentos: Lancamento[], coluna: string) {
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

  update(acao: string, event: any, item: Lancamento) {
    this.lancamentoService.findById(item.id).subscribe(data => {
      if (acao == 'fixo') {
        data.fixo = event._checked;
      } else if (acao == 'concluido') {
        data.concluido = event._checked;
      }
      this.lancamentoService.update(data).subscribe();
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

  processarLabels(conta: any) {
    let obj = { idPlanilha: this.planilhaSelecionada.id, idConta: conta.id };
    this.lancamentoService.processarLabels(obj).subscribe(()=>{
      this.analiseService.getExtrato(true);
    });
  }

  filtrarSemLabels(){
    this.analiseService.filtrarExtratoPorCategoria(undefined);
  }

}

export class OrdemExtrato {
  sort: number = 1;
  indexConta?: number;
  lancamentos?: Lancamento[];
  coluna?: string;
}