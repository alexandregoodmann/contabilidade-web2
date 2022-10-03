import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatChip } from '@angular/material/chips';
import { Conta } from 'src/app/models/conta';
import { ContaService } from 'src/app/services/conta.service';

@Component({
  selector: 'app-conta',
  templateUrl: './conta.component.html',
  styleUrls: ['./conta.component.css']
})
export class ContaComponent implements OnInit {

  group!: FormGroup;
  contas!: Conta[];
  cargas = cargasArquivo;
  tipos = tiposConta;
  displayedColumns: string[] = ['banco', 'descricao', 'carga', 'delete'];

  constructor(
    private fb: FormBuilder,
    private contaService: ContaService,
  ) { }

  ngOnInit() {
    this.group = this.fb.group({
      id: [null],
      banco: [null, [Validators.required]],
      descricao: [null, [Validators.required]],
      tipo: [null, [Validators.required]],
      carga: [null]
    });
    this.findAll();
  }

  setTipo(chip: MatChip) {
    chip.toggleSelected();
    this.group.get('tipo')?.setValue(chip.value);
  }

  setCarga(chip: MatChip) {
    chip.toggleSelected();
    this.group.get('carga')?.setValue(chip.value);
  }

  edit(conta: Conta) {
    this.group.patchValue(conta);
  }

  salvar() {

    let model = new Conta(this.group.value);

    if (this.group.get('id')?.value != null) {
      this.contaService.create(model).subscribe({
        complete: () => {
          this.findAll();
        }
      });
    } else {
      this.contaService.update(model).subscribe({
        complete: () => {
          this.findAll();
        }
      });
    }

  }

  delete(id: number) {
    this.contaService.delete(id).subscribe({
      complete: () => {
        this.group.reset();
        this.findAll();
      }
    });
  }

  findAll() {
    this.contaService.findAll().subscribe(data => {
      this.contas = data;
    });
  }
}

export const tiposConta = [
  { tipo: "CC", descricao: "Conta corrente" },
  { tipo: "CARTAO", descricao: "Cartão de crédito" },
  { tipo: "CARTEIRA", descricao: "Carteira de dinheiro" },
  { tipo: "REFEICAO", descricao: "Vale refeição" },
  { tipo: "ALIMENTACAO", descricao: "Vale alimentação" },
];

export const cargasArquivo = [
  { arquivo: "BRADESCO", descricao: "Bradesco" },
  { arquivo: "C6", descricao: "Cartão C6" }
];