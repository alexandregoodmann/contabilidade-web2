import { Component, Input } from '@angular/core';
import { ChartType, Row } from 'angular-google-charts';

@Component({
  selector: 'app-chart-bar',
  templateUrl: './chart-bar.component.html',
  styleUrls: ['./chart-bar.component.scss']
})
export class ChartBarComponent {

  @Input() datasource!: Row[];
  @Input() width!: number;
  @Input() height!: number;
  @Input() columns!: string[];

  type: ChartType = ChartType.Bar;
  options = {
    bars: 'vertical',
    annotations: {
      alwaysOutside: false
    },
    legend: {
      position: 'none'
    }
  };

}
