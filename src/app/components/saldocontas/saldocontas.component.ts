import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { ChartType } from 'angular-google-charts';
import { ExtratoService } from 'src/app/services/extrato.service';
import { PlanilhaService } from 'src/app/services/planilha.service';
import { compare } from '../resumo-extrato/resumo-extrato.component';

@Component({
  selector: 'app-saldocontas',
  templateUrl: './saldocontas.component.html',
  styleUrls: ['./saldocontas.component.scss']
})
export class SaldocontasComponent implements OnInit {

  //grafico
  title = 'Saldo das Contas';
  type = ChartType.BarChart;
  datasource = [
    ['', 0, 0]
  ];
  columnNames = ['Conta', 'Saldo', { role: 'annotation' }];
  options = {
    bar: { groupWidth: "40%" },
    legend: { position: "none" }
  };
  width = 500;
  height = 250;

  constructor(
    private extratoService: ExtratoService,
    private planilhaService: PlanilhaService
  ) { }

  ngOnInit(): void {
    this.planilhaService.planilhaSelecionada.subscribe(planilha => {
      this.extratoService.getSaldoContas(planilha.ano, planilha.mes).subscribe(saldos => {
        this.datasource = [];
        saldos.forEach(d => {
          this.datasource.push([d.conta, d.saldo, d.saldo]);
        });
      });
    });
  }

}
