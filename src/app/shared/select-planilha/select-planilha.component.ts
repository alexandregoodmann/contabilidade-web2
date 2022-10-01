import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Planilha } from '../../model/planilha';
import { PlanilhasAno } from '../../model/PlanilhasAno';
import { PlanilhaService } from '../../services/planilha.service';

@Component({
  selector: 'app-select-planilha',
  templateUrl: './select-planilha.component.html',
  styleUrls: ['./select-planilha.component.scss']
})
export class SelectPlanilhaComponent implements OnInit {

  group = new FormGroup({
    ano: new FormControl(''),
    mes: new FormControl('')
  });

  planilhasAno: PlanilhasAno[] = [];
  planilhaSelecionada: Planilha = new Planilha();
  expanded = false;

  constructor(
    private planilhaService: PlanilhaService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.planilhaService.planilhasAno.subscribe(data => {
      this.planilhasAno = data;
    });

    this.planilhaService.planilhaSelecionada.subscribe(data => {
      this.planilhaSelecionada = data;
      /*
      this.group.get('ano').setValue(this.planilhaSelecionada.ano);
      this.group.get('mes').setValue(this.planilhaSelecionada);
      */
    });
  }

  get meses() {
    let ret;
    this.planilhasAno.forEach(a => {
      /*
      if (a.ano == this.group.get('ano').value) {
        ret = a.planilhas;
      }*/
    });
    return ret;
  }

  setPlanilhaMes(mes: Planilha) {
    this.planilhaService.setPlanilhaSelecionada(mes);
    this.expanded = false;
  }

}
