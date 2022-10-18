import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { ChartType } from 'angular-google-charts';
import { AnaliseDTO } from 'src/app/models/analiseDTO';
import { ChartDefinition } from 'src/app/models/ChartDefinition';
import { Planilha } from 'src/app/models/planilha';
import { AnaliseService } from 'src/app/services/analise.service';
import { PlanilhaService } from 'src/app/services/planilha.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-analise',
  templateUrl: './analise.component.html',
  styleUrls: ['./analise.component.scss']
})
export class AnaliseComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSort) sort!: MatSort;

  colunas: string[] = ['data', 'banco', 'categoria', 'descricao', 'valor'];
  datasource: AnaliseDTO[] = [];
  planilhaSelecionada: Planilha = new Planilha();
  pie!: ChartDefinition;

  constructor(
    private analiseService: AnaliseService,
    private planilhaService: PlanilhaService,
    private utilService: UtilService
  ) { }

  ngOnInit(): void {
    this.planilhaService.planilhaSelecionada.subscribe(data => {
      this.planilhaSelecionada = data;
      this.getAnalise();
      this.buildPieChart();
    });
  }

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe((sort) => {
      this.datasource = this.utilService.sortCollection(sort, this.datasource);
    });
  }

  getAnalise() {
    this.analiseService.getAnaliseAnoMes(this.planilhaSelecionada.ano, this.planilhaSelecionada.mes).subscribe(data => {
      this.datasource = data as AnaliseDTO[];
      this.buildPieChart();
    });
  }

  buildPieChart() {

    this.pie = new ChartDefinition();

    const analisar = this.datasource.filter(o => o.analisar);
    let mapaCategorias = new Map<string, number>();
    [...new Set(analisar.map(n => n.categoria))].forEach(categoria => {
      let valor = 0;
      analisar.filter(o => o.categoria == categoria).forEach(obj => {
        valor = valor + obj.valor;
      });
      mapaCategorias.set(categoria, valor * (-1))
    });

    this.pie.type = ChartType.PieChart;
    this.pie.width = 700;
    this.pie.height = 400;
    this.pie.columns = ['Categoria', 'Total'];
    mapaCategorias.forEach((v, k) => {
      this.pie.datasource.push([k, v]);
    });

    this.pie.options = {
      title: 'Gastos por Categoria',
      is3D: true,
      pieHole: 0.5,
      pieSliceText: 'none',
      legend: {
        position: 'labeled',
        maxLines: 3
      }
    };

  }
}