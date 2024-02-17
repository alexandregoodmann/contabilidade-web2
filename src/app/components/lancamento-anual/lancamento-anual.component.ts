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

    if (this.data.id) {
      this.planilhaanualService.findById(this.data.id).subscribe(data => {
        this.group.patchValue(data);

        let c = this.contas.find(o => o.descricao == data.conta);
        this.group.get('conta')?.setValue(c);
        this.group.get('data')?.setValue(new Date(data.data));
      });
    }
  }

  salvar() {
    let obj: PlanilhaAnual = this.group.value;
    if (this.data.id) { //edit
      let conta: Conta = this.group.value.conta;
      obj.conta = conta.descricao;
      obj.titulo = this.data.planilha;
      obj.id = this.data.id;
      this.planilhaanualService.update(obj).subscribe();
    } else { //new
      let conta: Conta = this.group.value.conta;
      obj.conta = conta.descricao;
      obj.titulo = this.data.planilha;
      this.planilhaanualService.create(obj).subscribe();
    }
  }

  setConta(chip: MatChip) {
    chip.toggleSelected();
    this.group?.get('conta')?.setValue(chip.value);
  }

  delete() {
    this.planilhaanualService.delete(this.data.id).subscribe();
  }
}
