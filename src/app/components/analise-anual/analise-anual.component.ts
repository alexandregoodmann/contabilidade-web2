import { Component, OnInit } from '@angular/core';
import { ChartType } from 'angular-google-charts';
import { AnaliseDTO } from 'src/app/models/analiseDTO';
import { ChartDefinition } from 'src/app/models/ChartDefinition';
import { AnaliseService } from 'src/app/services/analise.service';
import { PlanilhaService } from 'src/app/services/planilha.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-analise-anual',
  templateUrl: './analise-anual.component.html',
  styleUrls: ['./analise-anual.component.scss']
})
export class AnaliseAnualComponent implements OnInit {

  datasource!: AnaliseDTO[];
  width = 800;
  height = 300;

  entradasaida!: ChartDefinition;
  saldo!: ChartDefinition;
  categoria!: ChartDefinition;
  media!: ChartDefinition;

  constructor(
    private analiseService: AnaliseService,
    private planilhaService: PlanilhaService,
    private utilService: UtilService
  ) { }

  ngOnInit(): void {
    this.planilhaService.planilhaSelecionada.subscribe(planilha => {
      this.analiseService.getAnaliseAno(planilha.ano).subscribe(data => {
        this.datasource = data;
        this.graficoEntradaSaida();
        this.graficoSaldo();
        this.graficoCategoria();
        this.graficoMedia();
      });
    });
  }

  private graficoSaldo() {
    let matriz: number[][] = [];
    const lancamentos = this.datasource.filter(o => o.tipo != 'CARTÃO');
    const meses = [...new Set(lancamentos.map(n => n.planilha))];
    meses.forEach(mes => {
      let linha: any[] = [mes, 0];
      const lancamentosMes = lancamentos.filter(o => o.planilha == mes);
      const entradas = lancamentosMes.filter(o => o.valor > 0);
      const entrada = entradas.map(n => n.valor).reduce((a, b) => a + b);
      const saidas = lancamentosMes.filter(o => o.valor < 0 && o.categoria != 'Cartão');
      let saida = (saidas.length > 0) ? saidas.map(n => n.valor).reduce((a, b) => a + b) : 0;
      linha[1] = entrada + saida;
      matriz.push(linha);
    });
    this.saldo = new ChartDefinition();
    this.saldo.type = ChartType.AreaChart;
    this.saldo.columns = ['', 'Saldo'];
    this.saldo.datasource = matriz.reverse();
    this.saldo.options = {
      title: "Saldo mensal",
      vAxis: { minValue: 0 },
      width: this.width,
      height: this.height,
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
      title: "Total de entradas e de saídas por mês",
      vAxis: { minValue: 0 },
      width: this.width,
      height: this.height,
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
      title: "Gastos por categoria a cada mês",
      vAxis: { minValue: 0 },
      legend: {
        position: 'right'
      },
      width: this.width,
      height: this.height,
    };
  }

  private graficoMedia() {

    let matriz: any[][] = [];
    const analisar = this.datasource.filter(o => o.analisar && o.valor < 0);
    const categorias = [...new Set(analisar.map(n => n.categoria))];
    const meses = [...new Set(analisar.map(n => n.mes))];

    let medias: Array<{ categoria: string, mes: number, total: number }> = [];
    categorias.forEach(categoria => {
      meses.forEach(mes => {
        const filter = analisar.filter(o => o.categoria == categoria && o.mes == mes);
        if (filter.length > 0) {
          const total = filter.map(n => n.valor).reduce((a, b) => a + b);
          medias.push({ categoria: categoria, mes: mes, total: total * (-1) });
        } else {
          medias.push({ categoria: categoria, mes: mes, total: 0 });
        }
      });
    });

    let linhas: Array<{ categoria: string, media: number }> = [];
    categorias.forEach(categoria => {
      const filter = medias.filter(o => o.categoria == categoria);
      const media = filter.map(n => n.total).reduce((a, b) => a + b) / filter.length;
      linhas.push({ categoria: categoria, media: media });
    });

    linhas = this.utilService.sortCollection({ active: 'media', direction: 'desc' }, linhas);

    linhas.forEach(l => {
      matriz.push([l.categoria, l.media]);
    });

    this.media = new ChartDefinition();
    this.media.type = ChartType.ColumnChart;
    this.media.columns = ['', ''];
    this.media.datasource = matriz;

    this.media.options = {
      title: "Média de gasto anual por categoria",
      width: this.width,
      height: this.height,
      bar: { groupWidth: "90%" },
      legend: { position: "none" },
    };

  }
}

