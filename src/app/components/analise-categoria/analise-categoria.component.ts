import { Component, OnInit } from '@angular/core';
import { ChartType } from 'angular-google-charts';
import { AnaliseService } from 'src/app/services/analise.service';
import { PlanilhaService } from 'src/app/services/planilha.service';

@Component({
  selector: 'app-analise-categoria',
  templateUrl: './analise-categoria.component.html',
  styleUrls: ['./analise-categoria.component.scss']
})
export class AnaliseCategoriaComponent implements OnInit {

  title = 'Gastos em categorias';
  columnNames = ['Categoria', 'Percentage'];
  type = ChartType.PieChart;
  datasource = [
    ['Alimentação', 14.40]
  ];
  options = {
    is3D: true
  };
  width = 500;
  height = 500;

  constructor(
    private planilhaService: PlanilhaService,
    private analiseService: AnaliseService
  ) { }

  ngOnInit(): void {

    this.planilhaService.planilhaSelecionada.subscribe(planilha => {
      this.analiseService.getAnaliseCategoria(planilha.ano, planilha.mes).subscribe(data => {
        this.datasource = [];
        data.forEach(obj => {
          this.datasource.push([obj.descricao, obj.soma]);
        });
      });
    });
  }

}
