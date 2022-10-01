import { Component, OnInit } from '@angular/core';
import { Planilha } from '../../model/planilha';
import { PlanilhaService } from '../../services/planilha.service';

@Component({
  selector: 'app-link-planilha',
  templateUrl: './link-planilha.component.html',
  styleUrls: ['./link-planilha.component.scss']
})
export class LinkPlanilhaComponent implements OnInit {

  constructor(private planilhaService: PlanilhaService) { }

  planilha: Planilha;

  ngOnInit() {
    this.planilhaService.planilhaSelecionada.subscribe(data => {
      this.planilha = data;
    });
  }

}
