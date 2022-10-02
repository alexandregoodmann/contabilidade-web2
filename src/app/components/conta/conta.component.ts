import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatChip } from '@angular/material/chips';
import { Conta } from 'src/app/models/conta';
import { ContaService } from 'src/app/services/conta.service';

@Component({
  selector: 'app-conta',
  templateUrl: './conta.component.html',
  styleUrls: ['./conta.component.css']
})
export class ContaComponent implements OnInit {

  group = this.fb.group({
    banco: [null, [Validators.required]],
    descricao: [null, [Validators.required]],
    tipo: [null, [Validators.required]],
    carga: [null]
  });

  contas!: Conta[];
  cargas = cargasArquivo;
  tipos = tiposConta;
  displayedColumns: string[] = ['banco', 'descricao', 'carga', 'delete'];

  constructor(
    private fb: FormBuilder,
    private contaService: ContaService,
  ) { }

  ngOnInit() {
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

  salvar() {

    let model = new Conta(this.group.value);
    this.contaService.create(model).subscribe({
      complete: () => {
        this.findAll();
      }
    });

    /*
    if (this.conta == undefined) {
      let conta: Conta = this.group.value as unknown as Conta;
      if (conta.carga != undefined)
        conta?.carga = (conta.carga as string).toUpperCase();
    } else {

      let model = this.group.value;
      model.id = this.conta.id;

      if (model.carga != undefined)
        model.carga = (model.carga as string).toUpperCase();

      this.contaService.update(this.group.value).subscribe(() => { }, () => { }, () => {
        this.conta = undefined;
        this.group.reset();
        this.findAll();
      });
    }*/
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