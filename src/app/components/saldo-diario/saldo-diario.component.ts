import { Component, OnInit } from '@angular/core';
import { ChartType } from 'angular-google-charts';
import { Lancamento } from 'src/app/models/lancamento';
import { ExtratoService } from 'src/app/services/extrato.service';

@Component({
  selector: 'app-saldo-diario',
  templateUrl: './saldo-diario.component.html',
  styleUrls: ['./saldo-diario.component.scss']
})
export class SaldoDiarioComponent implements OnInit {

  graphicDataSource!: Lancamento[];
  ds: any;
  constructor(private extratoService: ExtratoService) { }

  ngOnInit(): void {
    this.graphicDataSource = this.extratoService.datasource;
    this.processMapa();
  }

  processMapa() {
    let mapa = new Map<number, number>();
    this.graphicDataSource.forEach(data => {
      let d = new Date(data.data);
      let day = d.getDate();
      if (mapa.has(day)) {
        let valor = (mapa.get(day) as number) + data.valor;
        mapa.set(day, valor);
      } else {
        mapa.set(day, data.valor);
      }
    });

    this.ds = [];
    mapa.forEach((v, k) => {
      this.ds.push([k, v]);
    });

    this.graficoBarra.datasource = this.ds

    console.log(this.ds);

  }


  graficoBarra = {
    title: 'Saldo Diário',
    columnNames: ['Dia', 'saldo'],
    type: ChartType.ColumnChart,
    datasource: [[1, 1000], [2, 1500]],
    options: {
      legend: { position: "none" }
    }
  };

}
