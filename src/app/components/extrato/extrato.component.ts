import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { Conta } from 'src/app/models/conta';
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
  diferenca: number = 0;

  planilhaSelecionada!: Planilha;
  contas!: Conta[];
  group!: FormGroup;
  sort!: Sort;

  constructor(
    private fb: FormBuilder,
    private lancamentoService: LancamentoService,
    private extratoService: ExtratoService,
    private dialog: MatDialog,
    private planilhaService: PlanilhaService,
  ) { }

  ngOnInit() {

    this.group = this.fb.group({
      conta: [null],
      descricao: [null],
      semLabel: [false],
      fixo: [false],
      concluido: [false]
    });

    //aplicar filtros do extrato
    this.group.valueChanges.subscribe(group => {
      this.extratoService.filtro = group;
      this.extratoService.filtrarExtrato();
    });

    this.planilhaService.planilhaSelecionada.subscribe(planilha => {
      this.planilhaSelecionada = planilha;
      this.planilhaService.getLancamentos(planilha.id).subscribe(lancamentos => {
        this.getContas(lancamentos);
        this.extrato = lancamentos;
        this.calcularTotais(this.extrato);
        this.extratoService.datasource = lancamentos;
      });
    });

    this.extratoService.extrato.subscribe(data => {
      this.extrato = data;
      this.calcularTotais(data);

      if (this.sort != null) {
        this.sortData(this.sort);
      }
    });

  }

  getContas(lancamentos: Lancamento[]) {
    this.contas = [];
    let mapa = new Map<number, Conta>();
    lancamentos.map(n => n.conta).forEach(conta => {
      mapa.set(conta.id, conta);
    });
    mapa.forEach((v, k) => {
      this.contas.push(v);
    });
    this.contas.sort((a, b) => {
      if (a.descricao > b.descricao)
        return 1;
      if (a.descricao < b.descricao)
        return -1;
      return 0;
    });
  }

  reload() {
    this.extratoService.updateDatasource();
    this.calcularTotais(this.extrato);
    this.group.reset();
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

  calcularTotais(lancamentos: Lancamento[]) {
    this.saldoAtual = 0;
    this.saldoPrevisto = 0;
    this.diferenca = 0;

    if (lancamentos.length >= 1) {
      this.saldoPrevisto = lancamentos.map(o => o.valor).reduce((a, b) => (a + b));

      let concluidos = lancamentos.filter(o => o.concluido);
      if (concluidos.length > 0)
        this.saldoAtual = concluidos.map(o => o.valor).reduce((a, b) => (a + b));

      this.diferenca = this.saldoPrevisto - this.saldoAtual;
    }
  }

  sortData(sort: Sort) {
    this.sort = sort;
    this.extrato = this.extrato.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      return sortColumn(a, b, sort.active, isAsc);
    });
  }

  openLancamento(idLancamento: number) {
    const dialogRef = this.dialog.open(LancamentoDialogComponent, {
      data: {
        idLancamento: idLancamento,
      },
    });
  }

  processarLabels() {
    let cc: any = this.group.get('conta')?.value;
    if (cc == null || cc == '') {
      alert('Informe a conta')
      return;
    }
    let conta = this.contas.find(o => o.id === cc.id);
    let dto = { idPlanilha: this.planilhaSelecionada.id, idConta: conta?.id };
    this.lancamentoService.processarLabels(dto).subscribe(() => { this.reload() });
  }
}

export function sortColumn(a: any, b: any, coluna: string, isAsc: boolean) {

  switch (coluna) {
    case 'data':
      let d1 = new Date(a.data);
      let d2 = new Date(b.data);
      return (d1 < d2 ? -1 : 1) * (isAsc ? 1 : -1);

    case 'conta':
      if (a.conta.descricao === b.conta.descricao)
        return (a.valor - b.valor) * (isAsc ? 1 : -1);
      return (a.conta.descricao as string).localeCompare((b.conta.descricao as string)) * (isAsc ? 1 : -1);

    case 'lancamento':
      if (a.descricao === b.descricao)
        return (a.valor - b.valor) * (isAsc ? 1 : -1);
      return (a.descricao as string).localeCompare((b.descricao as string)) * (isAsc ? 1 : -1);

    case 'fixo':
      let a_ = (a.fixo != null ? true : false);
      let b_ = (b.fixo != null ? true : false);
      if (a_ === b_)
        return (a.valor - b.valor) * (isAsc ? 1 : -1);
      return (a_ < b_ ? -1 : 1) * (isAsc ? 1 : -1);

    case 'valor':
      return (a.valor - b.valor) * (isAsc ? 1 : -1);

    case 'concluido':
      if (a.concluido === b.concluido)
        return (a.valor - b.valor) * (isAsc ? 1 : -1);
      return (a.concluido < b.concluido ? -1 : 1) * (isAsc ? 1 : -1);

    default:
      return 0;
  }
}

