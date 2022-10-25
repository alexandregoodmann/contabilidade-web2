import { Component, OnInit } from '@angular/core';
import { AnaliseDTO } from 'src/app/models/analiseDTO';
import { Planilha } from 'src/app/models/planilha';
import { AnaliseService } from 'src/app/services/analise.service';
import { PlanilhaService } from 'src/app/services/planilha.service';

@Component({
  selector: 'app-analise',
  templateUrl: './analise.component.html',
  styleUrls: ['./analise.component.scss']
})
export class AnaliseComponent implements OnInit {

  datasourceAno!: AnaliseDTO[];
  datasourceMes!: AnaliseDTO[];
  planilha!: Planilha;

  constructor(
    private planilhaService: PlanilhaService,
    private analiseService: AnaliseService
  ) { }

  ngOnInit(): void {
    this.planilhaService.planilhaSelecionada.subscribe(planilha => {
      this.planilha = planilha;
      this.analiseService.getAnaliseAno(planilha.ano).subscribe(data => {
        this.datasourceAno = data;
        this.datasourceMes = data.filter(o => o.mes == planilha.mes);
      });
    });
  }
}