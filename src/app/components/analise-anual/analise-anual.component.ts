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

  ngOnInit(): void {
    this.reload();
  }

  reload() {
    this.planilhaService.processPlanilhaAnual().subscribe(data => {
      this.datasourceTable = data as unknown as PlanilhaAnual[];
      for (let i = 0; i < 12; i++) {
        this.datasourceTable.forEach(e => {
          if (e.listValores != null && e.listValores[i] != null) {
            this.totais[i] = this.totais[i] + e.listValores[i];
          }
        });
      }
    });
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
        default:
          return compare(a.listValores[i], b.listValores[i], isAsc);
      }
    });
  }
}
