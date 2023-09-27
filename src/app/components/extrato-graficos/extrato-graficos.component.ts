import { Component, OnInit } from '@angular/core';
import { ChartType } from 'angular-google-charts';
import { ExtratoDTO } from 'src/app/models/extrato';
import { LabelService } from 'src/app/services/label.service';
import { PlanilhaService } from 'src/app/services/planilha.service';

@Component({
  selector: 'app-extrato-graficos',
  templateUrl: './extrato-graficos.component.html',
  styleUrls: ['./extrato-graficos.component.scss']
})
export class ExtratoGraficosComponent implements OnInit {

  extrato: ExtratoDTO[] = [];
  labels: string[] = [];

  title = 'Gastos em categorias';
  type = ChartType.PieChart;
  data: any[][] = [];
  columnNames = ['Browser', 'Percentage'];
  options = {
  };
  width = 550;
  height = 400;

  constructor(
    private labelService: LabelService,
    private planilhaService: PlanilhaService
  ) { }

  ngOnInit(): void {

    this.planilhaService.planilhaSelecionada.subscribe(planilha => {
      this.planilhaService.getExtrato(planilha.id).subscribe(extrato => {
        this.extrato = extrato;
      }, (error) => { }, () => {
        this.labelService.findAll().subscribe(data => {
          this.labels = data.filter(o => o.analisar).map(n => n.descricao);
        }, (err) => { }, () => {
          this.montaDatasource();
        });
      });
    });
  }

  montaDatasource() {
    let mapa = new Map<String, number>();
    this.extrato.forEach(conta => {
      conta.lancamentos.forEach(lancamento => {
        lancamento.labels.forEach(label => {
          if (this.labels.includes(label)) {
            mapa.set(label, lancamento.valor);
          }
        });
      });
    });

    mapa.forEach((v, k) => {
      let vet = [k, v];
      this.data.push(vet);
    });

    console.log(this.data);

  }

}
