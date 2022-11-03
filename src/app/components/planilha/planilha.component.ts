import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MESES } from 'src/app/app.module';
import { Planilha } from 'src/app/models/planilha';
import { PlanilhaService } from 'src/app/services/planilha.service';

@Component({
  selector: 'app-planilha',
  templateUrl: './planilha.component.html',
  styleUrls: ['./planilha.component.scss']
})
export class PlanilhaComponent implements OnInit {

  displayedColumns: string[] = ['ano', 'descricao', 'duplicar', 'delete'];
  group!: FormGroup;
  dataSource!: Planilha[];
  meses = MESES;

  constructor(
    private fb: FormBuilder,
    private planilhaService: PlanilhaService,
    private router: Router
  ) { }

  ngOnInit() {
    this.group = this.fb.group({
      ano: [null],
      mes: [null]
    });
    this.findAll();
  }

  salvar() {
    let g = this.group.value;
    let model: Planilha = new Planilha;
    model.ano = g.ano;
    model.descricao = g.mes.descricao;
    model.mes = g.mes.mes;
    this.planilhaService.create(model).subscribe(() => { }, () => { }, () => {
      this.findAll();
    });
  }

  findAll() {
    this.planilhaService.findAll().subscribe(data => {
      this.dataSource = data as unknown as Array<Planilha>;
    });
  }

  delete(id: number) {
    this.planilhaService.delete(id).subscribe(() => { this.findAll(); });
  }

  edit(obj: Planilha) {
    this.group.patchValue(obj);
  }

  duplicar(id: number) {
    this.planilhaService.duplicarPlanilha(id).subscribe(() => { this.findAll(); });
  }
}
