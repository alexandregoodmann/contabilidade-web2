import { Component, Input } from '@angular/core';
import { ChartType, Row } from 'angular-google-charts';

@Component({
  selector: 'app-chart-pie',
  templateUrl: './chart-pie.component.html',
  styleUrls: ['./chart-pie.component.scss']
})
export class ChartPieComponent {

  @Input() datasource!: Row[];
  type: ChartType = ChartType.PieChart;

  options = {
    pieHole: 0.5,
    is3D: true,
    pieSliceText: 'none',
    legend: {
      position: 'labeled',
      maxLines: 3
    }
  };

  onSelect(data: any): void {
    //console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data: any): void {
    //console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    //console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

}
