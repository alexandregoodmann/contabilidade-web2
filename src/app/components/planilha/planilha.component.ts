import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Planilha } from 'src/app/models/planilha';
import { PlanilhaService } from 'src/app/services/planilha.service';
import { Constants } from 'src/app/shared/Constants';

@Component({
  selector: 'app-planilha',
  templateUrl: './planilha.component.html',
  styleUrls: ['./planilha.component.scss']
})
export class PlanilhaComponent implements OnInit {

  displayedColumns: string[] = ['ano', 'descricao'];
  group!: FormGroup;
  dataSource!: Planilha[];
  meses = Constants.listaMeses;

  constructor(
    private fb: FormBuilder,
    private planilhaService: PlanilhaService,
    private router: Router
  ) { }

  ngOnInit() {

    this.group = this.fb.group({
      ano: [null],
      descricao: [null]
    });

    this.findAll();
  }

  salvar() {
    let model: Planilha = this.group.value;
    model.mes = Constants.listaMeses.indexOf(model.descricao) + 1;
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
    this.planilhaService.delete(id).subscribe({
      next: (v) => console.log(v),
      error: (e) => console.error(e),
      complete: () => console.info('complete')
    });
  }

  edit(obj: Planilha) {
    this.group.patchValue(obj);
  }
}
