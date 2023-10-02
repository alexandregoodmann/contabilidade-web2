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
import { PlanilhaService } from 'src/app/services/planilha.service';

@Component({
  selector: 'app-extrato',
  templateUrl: './extrato.component.html',
  styleUrls: ['./extrato.component.scss']
})
export class ExtratoComponent implements OnInit {

  group!: FormGroup;
  displayedColumns: string[] = ['acao', 'data', 'descricao', 'fixo', 'valor', 'concluido'];
  extrato: ExtratoDTO[] = [];
  saldoPrevisto: number = 0;
  saldoAtual: number = 0;
  planilhaSelecionada!: Planilha;
  marcados: number[] = [];
  labels!: Label[];
  filteredLabels: Label[] = [];
  expandidos: Map<number, boolean> = new Map<number, boolean>();
  ordem: OrdemExtrato = new OrdemExtrato();

  constructor(
    private planilhaService: PlanilhaService,
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
      if (data)
        this.filteredLabels = this.labels.filter(o => o.descricao.toLocaleLowerCase().includes(data.toLocaleLowerCase()));
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
      this.analiseService.getExtrato(true);
    });
  }

  marcarFixo() {
    this.lancamentoService.fixo(this.marcados).subscribe(() => { }, () => { }, () => {
      this.marcados = [];
      this.analiseService.getExtrato(true);
    });
  }

  deleteAll() {
    this.lancamentoService.deleteAll(this.marcados).subscribe(() => { }, () => { }, () => {
      this.marcados = [];
      this.analiseService.getExtrato(true);
    });
  }

  categorizar(label: Label) {
    this.lancamentoService.categorizar(this.marcados, label).subscribe(() => { }, () => { }, () => {
      this.marcados = [];
      this.analiseService.getExtrato(true);
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