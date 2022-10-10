import { Component, OnInit } from '@angular/core';
import { ChartType, Row } from 'angular-google-charts';
import { AnalisePlanilha, AnaliseSaldoAno, ChartDefinition } from 'src/app/models/analiseplanilha';
import { PlanilhaService } from 'src/app/services/planilha.service';
import { Constants } from 'src/app/shared/Constants';

@Component({
  selector: 'app-analise',
  templateUrl: './analise.component.html',
  styleUrls: ['./analise.component.scss']
})
export class AnaliseComponent implements OnInit {

  charSaldo!: ChartDefinition;
  columns: string[] = [];
  datasource: Row[] = [];

  constructor(private planilhaService: PlanilhaService) { }

  ngOnInit(): void {

    this.buildGraficoSaldoAtual();

    this.planilhaService.getAnaliseAno(2022).subscribe(data => {

      let analise = data as AnalisePlanilha[];
      let meses = new Set<number>(analise.map(o => o.mes));
      let categorias = new Set<string>(analise.map(o => o.descricao));
      this.columns.push('Mês');
      categorias.forEach(c => { this.columns.push(c) });

      meses.forEach(mes => {
        let row = [];
        row.push(Constants.listaMeses[mes - 1]);
        categorias.forEach(categ => {
          let obj = analise.filter(o => o.mes == mes && o.descricao == categ);
          if (obj.length > 0) {
            row.push(obj[0].valor);
          } else {
            row.push(0);
          }
        });
        this.datasource.push(row);
      });
    });
  }

  buildGraficoSaldoAtual() {

    this.planilhaService.getAnaliseSaldoAno(2022).subscribe(data => {
      let analise = data as AnaliseSaldoAno[];
      this.charSaldo.datasource = [];
      analise.forEach(a => {
        this.charSaldo.datasource.push([a.mes, a.entrada, a.saida, a.saldo]);
      });
    });

    this.charSaldo = new ChartDefinition();
    this.charSaldo.type = ChartType.AreaChart;
    this.charSaldo.width = 700;
    this.charSaldo.height = 350;
    this.charSaldo.columns = ['Mês', 'Entrada', 'Saída', 'Saldo'];
    this.charSaldo.options = {
      title: 'Total de entradas e saídas por mês',
      vAxis: { minValue: 0 }
    };
  }

}