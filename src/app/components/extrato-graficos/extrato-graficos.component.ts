import { Component, OnInit } from '@angular/core';
import { ChartType } from 'angular-google-charts';
import { ExtratoDTO } from 'src/app/models/extrato';
import { AnaliseService } from 'src/app/services/analise.service';
import { LabelService } from 'src/app/services/label.service';
import { PlanilhaService } from 'src/app/services/planilha.service';

@Component({
  selector: 'app-extrato-graficos',
  templateUrl: './extrato-graficos.component.html',
  styleUrls: ['./extrato-graficos.component.scss']
})
export class ExtratoGraficosComponent implements OnInit {

  extrato: ExtratoDTO[] = [];
  labels: string[] = [];

  title = 'Gastos em categorias';
  type = ChartType.PieChart;
  datasource = [
    ['Alimentação', 14.40]
  ];
  columnNames = ['Categoria', 'Percentage'];
  options = {
    is3D: true
  };
  width = 550;
  height = 400;

  constructor(
    private labelService: LabelService,
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
