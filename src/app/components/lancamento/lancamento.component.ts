import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatChip } from '@angular/material/chips';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Conta } from 'src/app/models/conta';
import { Label } from 'src/app/models/label';
import { Lancamento } from 'src/app/models/lancamento';
import { Planilha } from 'src/app/models/planilha';
import { ContaService } from 'src/app/services/conta.service';
import { ExtratoService } from 'src/app/services/extrato.service';
import { LabelService } from 'src/app/services/label.service';
import { LancamentoService } from 'src/app/services/lancamento.service';
import { PlanilhaService } from 'src/app/services/planilha.service';
import { ChipsComponent } from 'src/app/shared/chips/chips.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-lancamento',
  templateUrl: './lancamento.component.html',
  styleUrls: ['./lancamento.component.scss']
})
export class LancamentoComponent implements OnInit {

  @ViewChild(ChipsComponent) chips!: ChipsComponent;

  group!: FormGroup;
  contas!: Array<Conta>;
  labels!: string[];
  lancamento!: Lancamento;
  planilhaSelecionada!: Planilha;
  backto!: string | null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private contaService: ContaService,
    private labelService: LabelService,
    private lancamentoService: LancamentoService,
    private planilhaService: PlanilhaService,
    private snackBar: MatSnackBar,
    private extratoService: ExtratoService
  ) { }

  ngOnInit(): void {

    this.contaService.findAll().subscribe(data => {
      this.contas = data as unknown as Array<Conta>;
    });

    this.labelService.findAll().subscribe(data => {
      this.labels = (data as unknown as Array<Label>).map(o => o.descricao);
    });

    this.group = this.fb.group({
      conta: [null, [Validators.required]],
      labels: [null, [Validators.required]],
      data: [null, [Validators.required]],
      descricao: [null, [Validators.required]],
      valor: [null, [Validators.required]],
      tipo: [],
      parcelas: [],
      fixo: [null],
      concluido: [null]
    });

    this.group?.get('data')?.setValue(new Date());

    this.planilhaService.planilhaSelecionada.subscribe(data => {
      this.planilhaSelecionada = data;
    });

    if (this.data.idLancamento > 0) {
      this.lancamentoService.findById(this.data.idLancamento).subscribe(data => {
        this.lancamento = data as Lancamento;
        this.group?.patchValue(this.lancamento);
        this.group?.get('data')?.setValue(new Date(this.lancamento.data));
        this.group?.get('conta')?.setValue(this.lancamento.conta.id);
        this.group?.get('fixo')?.setValue(this.lancamento.fixo);
        this.group?.get('concluido')?.setValue(this.lancamento.concluido);
        this.group?.get('labels')?.setValue(this.lancamento.labels);
        this.group?.get('parcelas')?.setValue(this.lancamento.parcelas);
        this.group?.get('tipo')?.setValue(this.lancamento.tipo);
        this.chips.group.get('labels')?.setValue(this.lancamento.labels);
        this.chips.labels = this.lancamento.labels;
      });
    }
  }

  salvar() {

    let model = this.group?.value;
    model.conta = this.contas.filter(o => o.id == model.conta)[0];
    model.planilha = this.planilhaSelecionada;

    //edit
    if (this.lancamento && this.lancamento.id) {
      this.lancamento.valor = model.valor;
      this.lancamento.conta = model.conta;
      this.lancamento.data = model.data;
      this.lancamento.concluido = model.concluido;
      this.lancamento.fixo = model.fixo;
      this.lancamento.descricao = model.descricao;
      this.lancamento.parcelas = model.parcelas;
      this.lancamento.tipo = model.tipo;

      this.lancamentoService.update(this.lancamento).subscribe(() => {
      }, (err) => { }, () => {
        this.chips.group.reset();
        this.extratoService.updateDatasource();
      });

    } else { //new
      this.lancamentoService.create(model).subscribe(() => { }, (err) => { }, () => {
        this.chips.group.reset();
        this.chips.labels = [];
        this.extratoService.updateDatasource();
      });
    }

  }

  apagar() {
    this.lancamentoService.delete(this.lancamento.id).subscribe(() => {
      this.snackBar.open('Lançamento apagado', undefined, { duration: environment.tempoSnackBar });
    }, (err) => { }, () => {
      this.extratoService.updateDatasource();
    });
  }

  setConta(chip: MatChip) {
    chip.toggleSelected();
    this.group?.get('conta')?.setValue(chip.value);
  }

  updateLabels(labels: string[]) {
    this.group.get('labels')?.setValue(labels);
  }
}