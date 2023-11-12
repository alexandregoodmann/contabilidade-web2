import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { Planilha } from 'src/app/models/planilha';
import { ResumoExtrato } from 'src/app/models/resumo-extrato';
import { ExtratoService } from 'src/app/services/extrato.service';
import { PlanilhaService } from 'src/app/services/planilha.service';

@Component({
  selector: 'app-resumo-extrato',
  templateUrl: './resumo-extrato.component.html',
  styleUrls: ['./resumo-extrato.component.scss']
})
export class ResumoExtratoComponent implements OnInit {

  planilhaSelecionada!: Planilha;
  datasource: ResumoExtrato[] = [];
  filtrado: ResumoExtrato[] = [];
  label!: string;
  total!: number;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private extratoService: ExtratoService,
    private planilhaService: PlanilhaService,
  ) { }

  ngOnInit(): void {
    this.planilhaService.planilhaSelecionada.subscribe(data => { this.planilhaSelecionada = data });
    this.extratoService.getResumoExtrato(this.planilhaSelecionada.ano, this.planilhaSelecionada.mes).subscribe(data => {
      this.datasource = data;
      this.filtrarTabela('entrada');
    });
  }

  filtrarTabela(item: string) {
    switch (item) {
      case 'entrada':
        this.label = 'Total em entradas';
        this.filtrado = this.datasource.filter(o => o.valor >= 0);
        break;
      case 'saida':
        this.label = 'Total em saídas';
        this.filtrado = this.datasource.filter(o => o.valor <= 0);
        break;
      case 'fixo':
        this.label = 'Total em gastos fixos';
        this.filtrado = this.datasource.filter(o => o.fixo && o.valor <= 0 && o.lancamento != 'Saldo Anterior');
        break;
      default:
        break;
    }
    this.total = this.filtrado.map(n => n.valor).reduce((a, b) => a + b);
    this.filtrado.forEach(e => {
      e.porcentagem = e.valor / this.total * 100;
    });
  }

  sortData(sort: Sort) {
    this.filtrado = this.filtrado.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'conta':
          return compare(a.conta, b.conta, isAsc);
        case 'lancamento':
          return compare(a.lancamento, b.lancamento, isAsc);
        case 'valor':
          return compare(a.valor, b.valor, isAsc);
        case 'porcentagem':
          return compare(a.porcentagem, b.porcentagem, isAsc);
        default:
          return 0;
      }
    });
  }

}

export function compare(a: number | string | Date | boolean, b: number | string | Date | boolean, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}