import { Component, Input } from '@angular/core';
import { ChartType, Row } from 'angular-google-charts';

@Component({
  selector: 'app-chart-line',
  templateUrl: './chart-line.component.html',
  styleUrls: ['./chart-line.component.scss']
})
export class ChartLineComponent {

  @Input() columns!: string[];
  @Input() datasource!: Row[];

  type: ChartType = ChartType.Line;

  options = {
    chart: {
      title: 'Gastos em categorias por mês'
    },
    width: 700,
    height: 350
  };


}
