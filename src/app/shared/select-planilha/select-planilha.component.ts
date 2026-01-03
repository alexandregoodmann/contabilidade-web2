import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Planilha } from 'src/app/models/planilha';
import { PlanilhasAno } from 'src/app/models/planilhasano';
import { PlanilhaService } from '../../services/planilha.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-select-planilha',
  templateUrl: './select-planilha.component.html',
  styleUrls: ['./select-planilha.component.scss']
})
export class SelectPlanilhaComponent implements OnInit {

  @Input()
  titulo: string = '';

  group = new FormGroup({
    ano: new FormControl(''),
    mes: new FormControl('')
  });

  planilhasAno: PlanilhasAno[] = [];
  planilhaSelecionada: Planilha = new Planilha();
  expanded = false;

  constructor(
    private planilhaService: PlanilhaService,
    private router: Router
  ) { }

  ngOnInit() {
    this.planilhaService.planilhasAno.subscribe(data => {
      this.planilhasAno = data;
    });

    this.planilhaService.planilhaSelecionada.subscribe(data => {
      this.planilhaSelecionada = data;
    });
  }

  setPlanilhaMes(mes: Planilha) {
    this.planilhaService.setPlanilhaSelecionada(mes);
    this.expanded = false;
  }

  voltar() {
    this.router.navigate(['/home']);
  }

}
