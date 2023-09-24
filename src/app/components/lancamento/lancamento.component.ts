import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChip, MatChipInputEvent } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Conta } from 'src/app/models/conta';
import { Lancamento } from 'src/app/models/lancamento';
import { Planilha } from 'src/app/models/planilha';
import { ContaService } from 'src/app/services/conta.service';
import { LabelService } from 'src/app/services/label.service';
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
  lancamento!: Lancamento;
  planilhaSelecionada!: Planilha;
  backto!: string | null;

  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredLabels: string[] = [];
  labels: string[] = [];
  allLabels: string[] = [];

  constructor(
    private fb: FormBuilder,
    private contaService: ContaService,
    private lancamentoService: LancamentoService,
    private planilhaService: PlanilhaService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private labelService: LabelService
  ) { }

  ngOnInit(): void {

    this.labelService.findAll().subscribe(data => {
      this.allLabels = data.map(o => o.descricao);
    });

    this.contaService.findAll().subscribe(data => {
      this.contas = data as unknown as Array<Conta>;
    });

    this.group = this.fb.group({
      conta: [null, [Validators.required]],
      labels: [null, [Validators.required]],
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
      if (param.get('idLancamento')) {
        this.backto = param.get('backto');
        let idLancamento = param.get('idLancamento') as unknown as number;
        this.lancamentoService.findById(idLancamento).subscribe(data => {
          this.lancamento = data as Lancamento;
          this.group?.patchValue(this.lancamento);
          this.group?.get('data')?.setValue(new Date(this.lancamento.data));
          this.group?.get('conta')?.setValue(this.lancamento.conta.id);
          this.group?.get('fixo')?.setValue(this.lancamento.fixo);
          this.group?.get('concluido')?.setValue(this.lancamento.concluido);
          this.group?.get('labels')?.setValue(this.lancamento.labels);
        });
      }
    });

    this.group.get('labels')?.valueChanges.subscribe(data => {
      let search = (data == null || data == undefined) ? '' : data;
      if (search.id == undefined)
        this.filteredLabels = this.allLabels.filter(o => o.toLowerCase().includes(search.toLowerCase()));
    });

  }

  salvar() {

    let model = this.group?.value;
    model.conta = this.contas.filter(o => o.id == model.conta)[0];
    model.planilha = this.planilhaSelecionada;

    console.log(model);
    return;
    
    //edit
    if (this.lancamento && this.lancamento.id) {
      this.lancamento.valor = model.valor;
      this.lancamento.conta = model.conta;
      this.lancamento.data = model.data;
      this.lancamento.concluido = model.concluido;
      this.lancamento.fixo = model.fixo;
      this.lancamento.descricao = model.descricao;

      this.lancamentoService.update(this.lancamento).subscribe(() => {
        this.router.navigate([this.backto]);
      }, (err) => { }, () => {
      });

    } else { //new
      this.lancamentoService.create(model).subscribe(() => { }, (err) => { }, () => {
      });
    }

  }

  apagar() {
    this.lancamentoService.delete(this.lancamento.id).subscribe(() => {
      this.snackBar.open('Lançamento apagado', undefined, { duration: environment.tempoSnackBar });
      this.router.navigate(['/extrato'],);
    });
  }

  setConta(chip: MatChip) {
    chip.toggleSelected();
    this.group?.get('conta')?.setValue(chip.value);
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.labels.push(value);
    }
  }

  remove(fruit: string): void {
    const index = this.labels.indexOf(fruit);
    if (index >= 0) {
      this.labels.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.labels.push(event.option.viewValue);
  }
}