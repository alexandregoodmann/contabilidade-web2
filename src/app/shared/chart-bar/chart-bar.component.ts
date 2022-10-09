import { Component, Input } from '@angular/core';
import { ChartType, Row } from 'angular-google-charts';

@Component({
  selector: 'app-chart-bar',
  templateUrl: './chart-bar.component.html',
  styleUrls: ['./chart-bar.component.scss']
})
export class ChartBarComponent {

  @Input() columns!: string[];
  @Input() datasource!: Row[];
  @Input() width!: number;
  @Input() height!: number;

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