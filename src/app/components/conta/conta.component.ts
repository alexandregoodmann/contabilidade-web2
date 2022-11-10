import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Banco } from 'src/app/models/banco';
import { Conta } from 'src/app/models/conta';
import { ContaService } from 'src/app/services/conta.service';

@Component({
  selector: 'app-conta',
  templateUrl: './conta.component.html',
  styleUrls: ['./conta.component.css']
})
export class ContaComponent implements OnInit {

  group!: FormGroup;
  bancos!: Banco[];
  bancoFiltro!: string[];
  contas!: Conta[];
  displayedColumns: string[] = ['banco', 'descricao', 'tipo', 'carga', 'delete'];

  constructor(
    private fb: FormBuilder,
    private contaService: ContaService,
  ) { }

  ngOnInit() {

    this.group = this.fb.group({
      id: [null],
      banco: [null, [Validators.required]],
      descricao: [null, [Validators.required]],
      tipo: [null, [Validators.required]]
    });

    this.contaService.findAllBancos().subscribe(data => {
      this.bancos = data;
      this.bancoFiltro = this.bancos.map(n => n.nomeReduzido);
    });

    this.group.get('banco')?.valueChanges.subscribe(data => {
      if (data != undefined)
        this.bancoFiltro = this.bancos.filter(o => o.nomeReduzido.toLowerCase().includes(data.toLowerCase())).map(n => n.nomeReduzido);
    });

    this.findAll();
  }

  setTipo(item: string) {
    this.group.get('tipo')?.setValue(item);
  }

  get carga() {
    let descricao = this.group.get('banco')?.value;
    if (descricao == undefined)
      return false;
    let banco = this.bancos.find(o => o.nomeReduzido === descricao);
    return banco?.carga;
  }

  edit(conta: Conta) {
    this.group.patchValue(conta);
    this.group.get('banco')?.setValue(conta.banco.nomeReduzido);
  }

  salvar() {

    let model = this.group.value;
    model.banco = this.bancos.find(o => o.nomeReduzido === model.banco);

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
