import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { PlanilhaAnual } from 'src/app/models/analise-categoria';
import { PlanilhaService } from 'src/app/services/planilha.service';
import { compare } from '../resumo-extrato/resumo-extrato.component';

@Component({
  selector: 'app-analise-anual',
  templateUrl: './analise-anual.component.html',
  styleUrls: ['./analise-anual.component.scss']
})
export class AnaliseAnualComponent implements OnInit {

  constructor(
    private planilhaService: PlanilhaService
  ) { }

  datasourceTable: PlanilhaAnual[] = [];
  totais: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  total_acumulado: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  ngOnInit(): void {
    this.planilhaService.processPlanilhaAnual().subscribe(data => {
      this.datasourceTable = data as unknown as PlanilhaAnual[];
      this.calcularTotais();
    });
  }

  calcularTotais() {
    for (let i = 0; i < 12; i++) {
      this.datasourceTable.forEach(e => {
        if (e.tipoLancamento != 'FATURA' && e.listValores != null && e.listValores[i] != null) {
          this.totais[i] = this.totais[i] + e.listValores[i];
        }
      });
      this.total_acumulado[0] = this.totais[0];
      if (i > 0)
        this.total_acumulado[i] = this.total_acumulado[i - 1] + this.totais[i];
    }
  }

  sortData(sort: Sort) {
    this.datasourceTable = this.datasourceTable.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      let i = sort.active as unknown as number;
      switch (sort.active) {
        case 'conta':
          return compare(a.conta, b.conta, isAsc);
        case 'descricao':
          return compare(a.descricao, b.descricao, isAsc);
        case 'fixo':
          let a_fixo = (a.fixo != null && a.fixo != '') ? true : false;
          let b_fixo = (b.fixo != null && b.fixo != '') ? true : false;
          return compare(a_fixo, b_fixo, isAsc);
        case 'tipo':
          let aa = (a.tipoLancamento == null) ? '' : a.tipoLancamento;
          let bb = (b.tipoLancamento == null) ? '' : b.tipoLancamento;
          return compare(aa, bb, isAsc);
        default:
          let m = (a.listValores[i] == null) ? 0 : a.listValores[i];
          let n = (b.listValores[i] == null) ? 0 : b.listValores[i];
          return compare(m, n, isAsc);
      }
    });
  }
}
