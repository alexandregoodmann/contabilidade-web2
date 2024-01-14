import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatChip } from '@angular/material/chips';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PlanilhaAnual } from 'src/app/models/analise-categoria';
import { Conta } from 'src/app/models/conta';
import { PlanilhaanualService } from 'src/app/planilhaanual.service';
import { ContaService } from 'src/app/services/conta.service';

@Component({
  selector: 'app-lancamento-anual',
  templateUrl: './lancamento-anual.component.html',
  styleUrls: ['./lancamento-anual.component.scss']
})
export class LancamentoAnualComponent implements OnInit {

  group!: FormGroup;
  contas!: Conta[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private contaService: ContaService,
    private planilhaanualService: PlanilhaanualService
  ) { }

  ngOnInit(): void {
    this.group = this.fb.group({
      data: [null, [Validators.required]],
      conta: [null, [Validators.required]],
      descricao: [null, [Validators.required]],
      fixo: [],
      valor: [null, [Validators.required]],
      parcelas: [],
    });
    this.contaService.findAll().subscribe(data => { this.contas = data }, (err) => { }, () => {
    });
  }

  salvar() {
    debugger
    console.log(this.group.value);
    let obj: PlanilhaAnual = this.group.value;
    let conta: Conta = this.group.value.conta;
    obj.titulo = this.data;
    obj.conta = conta.descricao;
    this.planilhaanualService.create(obj).subscribe();
  }

  setConta(chip: MatChip) {
    chip.toggleSelected();
    this.group?.get('conta')?.setValue(chip.value);
  }

}
