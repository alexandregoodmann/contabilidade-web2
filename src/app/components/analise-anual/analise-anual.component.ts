import { Component, Input, OnInit } from '@angular/core';
import { ChartType } from 'angular-google-charts';
import { AnaliseDTO } from 'src/app/models/analiseDTO';
import { ChartDefinition } from 'src/app/models/ChartDefinition';
import { Constants } from 'src/app/shared/Constants';

@Component({
  selector: 'app-analise-anual',
  templateUrl: './analise-anual.component.html',
  styleUrls: ['./analise-anual.component.scss']
})
export class AnaliseAnualComponent implements OnInit {

  @Input() datasource!: AnaliseDTO[];
  line!: ChartDefinition;
  chartProjecaoGastos!: ChartDefinition;
  chartProjecaoSaldo!: ChartDefinition;

  constructor() { }

  ngOnInit(): void {
    this.lineChart();
    this.projecaoGastos();
    this.projecaoSaldo();
  }

  private somar(valores: number[]): number {
    let total = 0;
    valores.forEach(v => {
      total = total + v;
    });
    if (total < 0)
      total = total * (-1);
    return total;
  }

  private projecaoSaldo() {
    let matriz: number[][] = [];
    const lancamentos = this.datasource.filter(o => o.tipo != 'CARTAO');
    const meses = [...new Set(lancamentos.map(n => n.planilha))];
    meses.forEach(mes => {
      let linha: any[] = [mes, 0];
      const lancamentosMes = lancamentos.filter(o => o.planilha == mes);
      //saldo
      linha[1] = this.somar(lancamentosMes.map(n => n.valor));
      matriz.push(linha);
    });

    this.chartProjecaoSaldo = new ChartDefinition();
    this.chartProjecaoSaldo.type = ChartType.AreaChart;
    this.chartProjecaoSaldo.columns = ['', 'Saldo'];
    this.chartProjecaoSaldo.datasource = matriz.reverse();
    this.chartProjecaoSaldo.options = {
      title: 'Projeção de saldos',
      vAxis: { minValue: 0 },
      width: 600,
      height: 200,
      legend: {
        position: 'none'
      }
    };
  }

  private projecaoGastos() {
    let matriz: number[][] = [];
    const lancamentos = this.datasource.filter(o => o.tipo != 'CARTAO');
    const meses = [...new Set(lancamentos.map(n => n.planilha))];
    meses.forEach(mes => {
      let linha: any[] = [mes, 0, 0];
      const lancamentosMes = lancamentos.filter(o => o.planilha == mes);
      //gasto
      linha[1] = this.somar(lancamentosMes.filter(o => o.valor < 0).map(n => n.valor));
      //fixo
      linha[2] = this.somar(lancamentosMes.filter(o => o.valor < 0 && o.fixo == true).map(n => n.valor));
      matriz.push(linha);
    });

    this.chartProjecaoGastos = new ChartDefinition();
    this.chartProjecaoGastos.type = ChartType.AreaChart;
    this.chartProjecaoGastos.columns = ['', 'Gastos', 'Fixos'];
    this.chartProjecaoGastos.datasource = matriz.reverse();
    this.chartProjecaoGastos.options = {
      title: 'Projeção de gastos',
      vAxis: { minValue: 0 },
      width: 600,
      height: 200,
      legend: {
        position: 'in'
      }
    };
  }

  private lineChart() {

    let matriz: number[][] = [];
    const analisar = this.datasource.filter(o => o.analisar);
    const categorias = [...new Set(analisar.map(n => n.categoria))];
    const meses = [...new Set(analisar.map(n => n.mes))];

    meses.forEach(mes => {
      let linha: any[] = [];
      linha.push(Constants.mesesAbreviados[mes - 1]);
      categorias.forEach(categoria => {
        let soma = 0;
        analisar.filter(o => o.mes == mes && o.categoria == categoria).forEach(lancamento => {
          soma = soma + lancamento.valor;
        });
        linha.push(soma * (-1));
      });
      matriz.push(linha);
    });

    this.line = new ChartDefinition();
    this.line.type = ChartType.Line;
    this.line.columns = [''].concat(categorias);
    this.line.datasource = matriz.reverse();
    this.line.options = {
      legend: {
        position: 'left'
      },
      chart: {
        title: 'Projeção de categorias',
      },
      width: 500,
      height: 300
    };
  }

}
