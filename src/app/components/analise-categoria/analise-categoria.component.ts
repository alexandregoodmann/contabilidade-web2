import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { ChartType } from 'angular-google-charts';
import { AnaliseCategoria } from 'src/app/models/analise-categoria';
import { ExtratoService } from 'src/app/services/extrato.service';
import { PlanilhaService } from 'src/app/services/planilha.service';
import { compare } from '../extrato/extrato.component';

@Component({
  selector: 'app-analise-categoria',
  templateUrl: './analise-categoria.component.html',
  styleUrls: ['./analise-categoria.component.scss']
})
export class AnaliseCategoriaComponent implements OnInit {

  // grafic
  title = 'Gastos em categorias';
  columnNames = ['Categoria', 'Percentage'];
  type = ChartType.PieChart;
  datasource = [
    ['Alimentação', 14.40]
  ];
  options = {
    is3D: true
  };
  width = 400;
  height = 300;

  //table
  datasourceTable: AnaliseCategoria[] = [];
  total: number = 0;

  constructor(
    private planilhaService: PlanilhaService,
    private extratoService: ExtratoService
  ) { }

  ngOnInit(): void {
    this.planilhaService.planilhaSelecionada.subscribe(planilha => {
      this.extratoService.getAnaliseCategoria(planilha.ano, planilha.mes).subscribe(data => {
        this.datasourceTable = data;
        this.total = this.datasourceTable.map(o => o.soma).reduce((a, b) => a + b);
        this.datasourceTable.forEach(e => {
          e.porcentagem = e.soma / this.total * 100;
        });
        this.datasource = [];
        data.forEach(obj => {
          this.datasource.push([obj.descricao, obj.soma]);
        });
      });
    });
  }

  filter(e: any) {
    if (e.selection.length > 0) {
      let i: number = e.selection[0].row as number;
      let label = this.datasource[i][0] as string;
      this.extratoService.filtrarExtratoPorCategoria(label);
    }
  }

  sortData(sort: Sort) {
    this.datasourceTable = this.datasourceTable.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'descricao':
          return compare(a.descricao, b.descricao, isAsc);
        case 'soma':
          return compare(a.soma, b.soma, isAsc);
        case 'porcentagem':
          return compare(a.porcentagem, b.porcentagem, isAsc);
        default:
          return 0;
      }
    });
  }

}
