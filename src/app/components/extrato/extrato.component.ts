import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Categoria } from 'src/app/models/categoria';
import { ExtratoDTO } from 'src/app/models/extrato';
import { LancamentoDTO } from 'src/app/models/lancamentoDTO';
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

  displayedColumns: string[] = ['acao', 'data', 'categoria', 'descricao', 'fixo', 'valor', 'concluido'];
  extrato!: ExtratoDTO[];
  order: number = 1;
  saldoPrevisto: number = 0;
  saldoAtual: number = 0;
  planilhaSelecionada!: Planilha;
  marcados: number[] = [];
  categorias!: Categoria[];
  expandidos: Map<number, boolean> = new Map<number, boolean>();

  constructor(
    private planilhaService: PlanilhaService,
    private lancamentoService: LancamentoService,
    private categoriaService: CategoriaService,
    private router: Router
  ) { }

  ngOnInit() {
    this.planilhaService.planilhaSelecionada.subscribe(planilha => {
      this.planilhaSelecionada = planilha;
      this.findExtrato();
    });
    this.categoriaService.findAll().subscribe(data => { this.categorias = data });
  }

  private findExtrato() {
    this.planilhaService.getExtrato(this.planilhaSelecionada.id).subscribe(data => {
      this.extrato = data;

      this.extrato.forEach(c => {
        c.lancamentos.forEach(l => {
          if (l.fixo != true)
            l.fixo = false;
        })
      });

      this.saldoPrevisto = 0;
      this.saldoAtual = 0;
      this.extrato.forEach(conta => {
        if (conta.tipo.toString() != 'CARTAO') {
          this.saldoPrevisto = this.saldoPrevisto + conta.saldoPrevisto;
          this.saldoAtual = this.saldoAtual + conta.saldoEfetivado;
        }
      });
    });
  }

  editar(idLancamento: number) {
    this.router.navigate(['/lancamento'], { queryParams: { backto: '/extrato', idLancamento: idLancamento } });
  }

  sortBy(indexConta: number, lancamentos: LancamentoDTO[], coluna: string) {
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

  marcar(event: any, item: LancamentoDTO) {
    if (event.checked) {
      item.marcado = true;
      this.marcados.push(item.id);
    } else {
      item.marcado = false;
      let i = this.marcados.indexOf(item.id);
      this.marcados.splice(i, 1);
    }
  }

  marcarTodos(event: any, lancamentos: LancamentoDTO[]) {
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

  categorizar(categoria: Categoria) {
    this.lancamentoService.categorizar(this.marcados, categoria).subscribe(() => { }, () => { }, () => {
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
