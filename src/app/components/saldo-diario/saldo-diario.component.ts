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

  extrato!: Lancamento[];
  dataSource: any;

  constructor(
    private extratoService: ExtratoService,
  ) { }

  ngOnInit(): void {
    this.extratoService.extrato.subscribe(data => {
      this.extrato = data;
      this.processDataSource();
    });
  }

  processDataSource() {

    
    // convert to date
    this.extrato.forEach(i => { i.data = new Date(i.data) });

    // get last day of the month
    let mes = new Date();
    let lastDayOfMonth = new Date(mes.getFullYear(), mes.getMonth() + 1, 0).getDate();

    let mapa = new Map<number, number>();
    for (let index = 1; index <= lastDayOfMonth; index++) {
      let lancamentosDia = this.extrato.filter(o => (o.data as Date).getDate() == index && o.conta.tipo == 'CC');
      let saldoDia = (lancamentosDia.length == 0) ? 0 : lancamentosDia.map(o => o.valor).reduce((a, b) => a + b);
      saldoDia = (index == 1) ? saldoDia : (saldoDia + (mapa.get(index - 1) as number));
      mapa.set(index, saldoDia);
    }

    this.dataSource = [];
    mapa.forEach((v, k) => {
      let color = (v > 0) ? '#3366cc' : '#dc3912';
      this.dataSource.push([k, v, color]);
    });
    this.graficoBarra.datasource = this.dataSource

  }

  graficoBarra = {
    title: 'Saldo Diário',
    columnNames: ['Dia', 'saldo', { role: 'style' }],
    type: ChartType.ColumnChart,
    datasource: [[1, 1000, '#3366cc']],
    options: {
      legend: { position: "none" }
    }
  };

}
