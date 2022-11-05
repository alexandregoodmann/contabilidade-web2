import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Categoria } from 'src/app/models/categoria';
import { LimiteGastos } from 'src/app/models/limitegastos';
import { Planilha } from 'src/app/models/planilha';
import { CategoriaService } from 'src/app/services/categoria.service';
import { LimitegastosService } from 'src/app/services/limitegastos.service';
import { PlanilhaService } from 'src/app/services/planilha.service';

@Component({
  selector: 'app-limitegastos',
  templateUrl: './limitegastos.component.html',
  styleUrls: ['./limitegastos.component.scss']
})
export class LimitegastosComponent implements OnInit {

  group!: FormGroup;
  categorias!: Categoria[];
  planilha!: Planilha;
  datasource!: LimiteGastos[];
  displayedColumns: string[] = ['categoria', 'analisar', 'limite', 'delete'];

  constructor(
    private fb: FormBuilder,
    private categoriaService: CategoriaService,
    private planilhaService: PlanilhaService,
    private limiteGastosService: LimitegastosService
  ) { }

  ngOnInit(): void {

    this.group = this.fb.group({
      categoria: [null, [Validators.required]],
      limite: [null, [Validators.required]]
    });

    this.categoriaService.findAll().subscribe(data => {
      this.categorias = data;
    });

    this.planilhaService.planilhaSelecionada.subscribe(data => {
      this.planilha = data
      this.findAll();
    });

  }

  findAll() {
    this.limiteGastosService.findAll().subscribe(data => {
      this.datasource = data.filter(o => o.planilha.ano == this.planilha.ano && o.planilha.mes == this.planilha.mes);
    });
  }

  salvar() {
    let model = this.group.value;
    model.planilha = this.planilha;
    this.limiteGastosService.create(model).subscribe(data => {
      this.findAll();
    });
  }

  delete(id: number) {
    this.limiteGastosService.delete(id).subscribe(() => {
      this.findAll();
    });
  }
}
