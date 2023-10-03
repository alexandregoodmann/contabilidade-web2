import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TipoConta } from 'src/app/models/conta';
import { ExtratoDTO } from 'src/app/models/extrato';
import { Label } from 'src/app/models/label';
import { Lancamento } from 'src/app/models/lancamento';
import { Planilha } from 'src/app/models/planilha';
import { AnaliseService } from 'src/app/services/analise.service';
import { LabelService } from 'src/app/services/label.service';
import { LancamentoService } from 'src/app/services/lancamento.service';

@Component({
  selector: 'app-extrato',
  templateUrl: './extrato.component.html',
  styleUrls: ['./extrato.component.scss']
})
export class ExtratoComponent implements OnInit {

  group!: FormGroup;
  displayedColumns: string[] = ['data', 'descricao', 'valor', 'fixo', 'concluido'];
  extrato: ExtratoDTO[] = [];
  saldoPrevisto: number = 0;
  saldoAtual: number = 0;
  planilhaSelecionada!: Planilha;
  labels!: Label[];
  filteredLabels: Label[] = [];
  expandidos: Map<number, boolean> = new Map<number, boolean>();
  ordem: OrdemExtrato = new OrdemExtrato();

  constructor(
    private lancamentoService: LancamentoService,
    private labelService: LabelService,
    private router: Router,
    private fb: FormBuilder,
    private analiseService: AnaliseService
  ) { }

  ngOnInit() {

    this.group = this.fb.group({
      labels: [null]
    });

    this.labelService.findAll().subscribe(data => { this.labels = data });

    this.group.get('labels')?.valueChanges.subscribe(data => {
      if (data) {
        this.filteredLabels = this.labels.filter(o => o.descricao.toLocaleLowerCase().includes(data.toLocaleLowerCase()));
      }
    });

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

  filtrar() {
    let label = this.group.get('labels')?.value;
    this.extrato.forEach(conta => {
      conta.lancamentos = conta.lancamentos = conta.lancamentos.filter(l => l.labels.includes(label));
    });
    this.extrato = this.extrato.filter(e => e.lancamentos.length > 0);
  }

}

export class OrdemExtrato {
  sort: number = 1;
  indexConta?: number;
  lancamentos?: Lancamento[];
  coluna?: string;
}