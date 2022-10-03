import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Categoria } from 'src/app/models/categoria';
import { Extrato } from 'src/app/models/extrato';
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
  saldo: number = 0;
  planilhaSelecionada!: Planilha;
  marcados: Lancamento[] = [];
  categorias!: Categoria[];
  expandidos: Map<number, boolean> = new Map<number, boolean>();

  //@ViewChild(MatAccordion, { static: false }) accordion: MatAccordion;

  constructor(
    private planilhaService: PlanilhaService,
    private lancamentoService: LancamentoService,
    private categoriaService: CategoriaService,
    private router: Router
  ) { }

  ngOnInit() {
    this.planilhaService.planilhaSelecionada.subscribe(planilha => {
      this.planilhaSelecionada = planilha;
    });

    if (this.planilhaSelecionada.id != undefined) {
      this.findExtrato();
    }
    this.categoriaService.findAll().subscribe(data => { this.categorias = data });
  }

  private findExtrato() {
    this.planilhaService.getExtrato(this.planilhaSelecionada.id).subscribe(data => {
      this.extrato = data as Extrato[];
      this.extrato.forEach(conta => {
        if (conta.tipo?.toString() == 'CC' || conta.tipo?.toString() == 'CARTEIRA') {
          this.saldo = this.saldo + conta.total;
        }
      });
    });
  }

  editar(idLancamento: number) {
    this.router.navigate(['/lancamento'], { queryParams: { idLancamento: idLancamento } });
  }

  sortBy(indexConta: number, lancamentos: Lancamento[], coluna: string) {
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

  marcar(event: any, item: Lancamento) {
    if (event.checked) {
      item.marcado = true;
      this.marcados.push(item);
    } else {
      item.marcado = false;
      let i = this.marcados.indexOf(item);
      this.marcados.splice(i, 1);
    }
  }

  marcarTodos(event: any, lancamentos: Lancamento[]) {
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
}

