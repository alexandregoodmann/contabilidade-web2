import { Component, OnInit } from '@angular/core';
import { ChartType } from 'angular-google-charts';
import { AnaliseDTO } from 'src/app/models/analiseDTO';
import { ChartDefinition } from 'src/app/models/ChartDefinition';
import { AnaliseService } from 'src/app/services/analise.service';
import { PlanilhaService } from 'src/app/services/planilha.service';

@Component({
  selector: 'app-analise-anual',
  templateUrl: './analise-anual.component.html',
  styleUrls: ['./analise-anual.component.scss']
})
export class AnaliseAnualComponent implements OnInit {

  datasource!: AnaliseDTO[];
  entradasaida!: ChartDefinition;
  saldo!: ChartDefinition;
  categoria!: ChartDefinition;
  width = 1200;

  constructor(
    private analiseService: AnaliseService,
    private planilhaService: PlanilhaService
  ) { }

  ngOnInit(): void {
    this.planilhaService.planilhaSelecionada.subscribe(planilha => {
      this.analiseService.getAnaliseAno(planilha.ano).subscribe(data => {
        this.datasource = data;
        this.graficoEntradaSaida();
        this.graficoSaldo();
        this.graficoCategoria();
      });
    });
  }

  private graficoSaldo() {
    let matriz: number[][] = [];
    const lancamentos = this.datasource.filter(o => o.tipo != 'CARTAO');
    const meses = [...new Set(lancamentos.map(n => n.planilha))];
    meses.forEach(mes => {
      let linha: any[] = [mes, 0];
      const lancamentosMes = lancamentos.filter(o => o.planilha == mes);
      const entradas = lancamentosMes.filter(o => o.valor > 0);
      const entrada = entradas.map(n => n.valor).reduce((a, b) => a + b);
      const saidas = lancamentosMes.filter(o => o.valor < 0 && o.categoria != 'Cartão' && o.concluido);
      const saida = saidas.map(n => n.valor).reduce((a, b) => a + b);
      linha[1] = entrada + saida;
      matriz.push(linha);
    });
    this.saldo = new ChartDefinition();
    this.saldo.type = ChartType.AreaChart;
    this.saldo.columns = ['', 'Saldo'];
    this.saldo.datasource = matriz.reverse();
    this.saldo.options = {
      vAxis: { minValue: 0 },
      width: this.width,
      height: 150,
      legend: {
        position: 'right'
      }
    };
  }

  private graficoEntradaSaida() {
    let matriz: number[][] = [];
    const lancamentos = this.datasource.filter(o => o.tipo != 'CARTAO');
    const meses = [...new Set(lancamentos.map(n => n.planilha))];
    meses.forEach(mes => {
      let linha: any[] = [mes, 0, 0];
      const lancamentosMes = lancamentos.filter(o => o.planilha == mes);
      const entradas = lancamentosMes.filter(o => o.valor > 0 && o.categoria != 'Saldo Anterior');
      if (entradas.length > 0)
        linha[1] = entradas.map(n => n.valor).reduce((a, b) => a + b);
      const saidas = lancamentosMes.filter(o => o.valor < 0 && o.categoria != 'Cartão');
      linha[2] = saidas.map(n => n.valor).reduce((a, b) => a + b) * (-1);
      matriz.push(linha);
    });
    this.entradasaida = new ChartDefinition();
    this.entradasaida.type = ChartType.AreaChart;
    this.entradasaida.columns = ['Mês', 'Entrada', 'Saída'];
    this.entradasaida.datasource = matriz.reverse();
    this.entradasaida.options = {
      vAxis: { minValue: 0 },
      width: this.width,
      height: 250,
      legend: {
        position: 'right'
      }
    };
  }

  private graficoCategoria() {
    let matriz: number[][] = [];
    const analisar = this.datasource.filter(o => o.analisar && o.valor < 0);
    const categorias = [...new Set(analisar.map(n => n.categoria))];
    const meses = [...new Set(analisar.map(n => n.planilha))];

    meses.forEach(mes => {
      let linha: any[] = [mes];
      categorias.forEach(categoria => {
        const somar = analisar.filter(o => o.planilha == mes && o.categoria == categoria);
        if (somar.length > 0) {
          linha.push(somar.map(n => n.valor).reduce((a, b) => a + b) * (-1));
        } else {
          linha.push(0);
        }
      });
      matriz.push(linha);
    });

    this.categoria = new ChartDefinition();
    this.categoria.type = ChartType.LineChart;
    this.categoria.columns = [''].concat(categorias);
    this.categoria.datasource = matriz.reverse();
    this.categoria.options = {
      vAxis: { minValue: 0 },
      legend: {
        position: 'right'
      },
      width: this.width,
      height: 500
    };
  }
}
