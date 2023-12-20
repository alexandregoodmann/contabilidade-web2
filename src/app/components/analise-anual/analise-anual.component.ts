import { Component, OnInit } from '@angular/core';
import { PlanilhaAnual } from 'src/app/models/analise-categoria';
import { PlanilhaService } from 'src/app/services/planilha.service';

@Component({
  selector: 'app-analise-anual',
  templateUrl: './analise-anual.component.html',
  styleUrls: ['./analise-anual.component.scss']
})
export class AnaliseAnualComponent implements OnInit {

  constructor(private planilhaService: PlanilhaService) { }

  planilhaAnual: PlanilhaAnual[] = [];

  ngOnInit(): void {
    this.reload();
  }

  reload() {
    this.planilhaService.getPlanilhaAnual().subscribe(data => {
      this.planilhaAnual = data as unknown as PlanilhaAnual[];
    });
  }

  process(){
    this.planilhaService.processPlanilhaAnual().subscribe();
  }
}
