import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatChip } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Categoria } from 'src/app/models/categoria';
import { Conta } from 'src/app/models/conta';
import { Lancamento } from 'src/app/models/lancamento';
import { Planilha } from 'src/app/models/planilha';
import { CategoriaService } from 'src/app/services/categoria.service';
import { ContaService } from 'src/app/services/conta.service';
import { LancamentoService } from 'src/app/services/lancamento.service';
import { PlanilhaService } from 'src/app/services/planilha.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-lancamento',
  templateUrl: './lancamento.component.html',
  styleUrls: ['./lancamento.component.scss']
})
export class LancamentoComponent implements OnInit {

  group!: FormGroup;
  contas!: Array<Conta>;
  categorias!: Array<Categoria>;
  lancamento!: Lancamento;
  planilhaSelecionada!: Planilha;

  constructor(
    private fb: FormBuilder,
    private contaService: ContaService,
    private categoriaService: CategoriaService,
    private lancamentoService: LancamentoService,
    private planilhaService: PlanilhaService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {

    this.contaService.findAll().subscribe(data => {
      this.contas = data as unknown as Array<Conta>;
    });

    this.categoriaService.findAll().subscribe(data => {
      this.categorias = data as unknown as Array<Categoria>;
    });

    this.group = this.fb.group({
      conta: [null, [Validators.required]],
      categoria: [null, [Validators.required]],
      data: [null, [Validators.required]],
      descricao: [null, [Validators.required]],
      valor: [null, [Validators.required]],
      fixo: [null],
      concluido: [null]
    });

    this.group?.get('data')?.setValue(new Date());

    this.planilhaService.planilhaSelecionada.subscribe(data => {
      this.planilhaSelecionada = data;
    });

    this.activatedRoute.queryParamMap.subscribe(param => {
      let idLancamento: number = param.get('idLancamento') as unknown as number;
      if (idLancamento != undefined) {
        this.lancamentoService.findById(idLancamento).subscribe(lancamento => {
          this.lancamento = lancamento;
          this.group?.patchValue(lancamento);
          this.group?.get('data')?.setValue(new Date(lancamento.data));
          this.group?.get('conta')?.setValue(lancamento.conta.id);
          if (lancamento.categoria != undefined) {
            this.group?.get('categoria')?.setValue(lancamento.categoria.id);
          }
          this.group?.get('fixo')?.setValue(lancamento.fixo);
          this.group?.get('concluido')?.setValue(lancamento.concluido);
        });
      }
    });
  }

  salvar() {

    let model = this.group?.value;
    model.categoria = this.categorias.filter(o => o.id == model.categoria)[0];
    model.conta = this.contas.filter(o => o.id == model.conta)[0];
    model.planilha = this.planilhaSelecionada;

    //edit
    if (this.lancamento && this.lancamento.id) {
      this.lancamento.valor = model.valor;
      this.lancamento.categoria = model.categoria;
      this.lancamento.conta = model.conta;
      this.lancamento.data = model.data;
      this.lancamento.concluido = model.concluido;
      this.lancamento.fixo = model.fixo;
      this.lancamento.descricao = model.descricao;
      this.lancamentoService.update(this.lancamento).subscribe(() => { }, () => { }, () => {
        this.router.navigate(['/extrato']);
      });
    } else { //new
      this.lancamentoService.create(model).subscribe(() => { }, () => { }, () => { });
    }

  }

  apagar() {
    this.lancamentoService.delete(this.lancamento.id).subscribe(() => { }, () => { }, () => {
      this.snackBar.open('Lançamento apagado', undefined, { duration: environment.tempoSnackBar });
      this.router.navigate(['/extrato'],);
    });
  }

  setConta(chip: MatChip) {
    chip.toggleSelected();
    this.group?.get('conta')?.setValue(chip.value);
  }

  setCategoria(chip: MatChip) {
    chip.toggleSelected();
    this.group?.get('categoria')?.setValue(chip.value);
  }

}