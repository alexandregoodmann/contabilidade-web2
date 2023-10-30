import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatChip } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Conta } from 'src/app/models/conta';
import { Planilha } from 'src/app/models/planilha';
import { ContaService } from 'src/app/services/conta.service';
import { PlanilhaService } from 'src/app/services/planilha.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-carga',
  templateUrl: './carga.component.html',
  styleUrls: ['./carga.component.scss']
})
export class CargaComponent implements OnInit {

  group!: FormGroup;
  contas!: Conta[];
  planilhaSelecionada!: Planilha;
  fileName = '';
  file!: File;

  constructor(
    private fb: FormBuilder,
    private planilhaService: PlanilhaService,
    private contaService: ContaService,
    private _snackBar: MatSnackBar,
    private http: HttpClient
  ) { }

  ngOnInit() {

    this.planilhaService.planilhaSelecionada.subscribe(data => { this.planilhaSelecionada = data });

    this.contaService.findAll().subscribe(data => {
      this.contas = data;
    });

    this.group = this.fb.group({
      conta: [null, [Validators.required]],
      cargaArquivo: [null, [Validators.required]]
    });
  }

  setConta(chip: MatChip) {
    chip.toggleSelected();
    this.group.get('conta')?.setValue(chip.value);
  }

  onFileSelected(event: any) {
    this.file = event.target.files[0];
    this.fileName = this.file.name;
    this.group.get('cargaArquivo')?.setValue(this.fileName);
  }

  enviar(form: any) {

    if (this.file) {
      const formData = new FormData();
      let conta: Conta = this.group.get('conta')?.value;
      formData.append("idConta", conta.id.toString());
      formData.append("idPlanilha", this.planilhaSelecionada.id.toString());
      formData.append("file", this.file);

      this.http.post(`${environment.url}/lancamentos/uploadFile`, formData).subscribe(data => {
        let retorno = data as RetornoCarga;
        this.openSnackBar(`SUCESSO: Foram inseridos ${retorno.qtdLancamentos} lançamentos.`);
      }, (error) => {
        if (error.error.status == 400) {
          this.openSnackBar('ERRO: Não foi possível fazer a carga do arquivo. Verifique a planilha, conta e arquivo.');
        } else if (error.error.status == 500) {
          this.openSnackBar('ERRO: Ocorreu um erro ao fazer a carga do arquivo');
        }
      });

      this.fileName = '';
      form.reset();
    }
  }

  private openSnackBar(msg: string) {
    this._snackBar.open(msg, 'Fechar', {
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

  confirmarCarga(form: any) {
    this._snackBar.open('Todos os lançamentos desta planilha serão sobrepostos. Deseja continuar?', 'SIM', {
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      duration: 3000
    }).onAction().subscribe(() => {
      this.enviar(form);
    });
  }
}

export interface RetornoCarga {
  idConta: number;
  idPlanilha: number;
  qtdLancamentos: number;
}