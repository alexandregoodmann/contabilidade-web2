import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Planilha } from 'src/app/models/planilha';
import { PlanilhaAnualDTO, PlanilhaanualService } from 'src/app/planilhaanual.service';
import { PlanilhaService } from 'src/app/services/planilha.service';

@Component({
  selector: 'app-planilhaanual',
  templateUrl: './planilhaanual.component.html',
  styleUrls: ['./planilhaanual.component.scss']
})
export class PlanilhaanualComponent implements OnInit {

  planilhaSelecionada!: Planilha;
  group!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private planilhaService: PlanilhaService,
    private planilhaAnualService: PlanilhaanualService
  ) { }

  ngOnInit(): void {

    this.planilhaService.planilhaSelecionada.subscribe(data => {
      this.planilhaSelecionada = data;
    });

    this.group = this.fb.group({
      descricao: [null, [Validators.required]]
    });
  }

  salvar() {
    let dto = new PlanilhaAnualDTO;
    dto.idPlanilha = this.planilhaSelecionada.id;
    dto.titulo = this.group.get('descricao')?.value;
    this.planilhaAnualService.criarPlanilhaAnual(dto).subscribe(() => {
      this.planilhaAnualService.getPlanilhas().subscribe(data => {
        this.planilhaAnualService.planilhasBehavior.next(data);
      })
    });
  }

}
