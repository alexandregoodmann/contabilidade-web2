import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Conta } from 'src/app/models/conta';
import { Label } from 'src/app/models/label';
import { Menu } from 'src/app/models/menu';
import { PlanilhasAno } from 'src/app/models/planilhasano';
import { ContaService } from 'src/app/services/conta.service';
import { PlanilhaService } from 'src/app/services/planilha.service';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.scss']
})
export class PrincipalComponent implements OnInit {

  contas: Conta[] = [];
  labels: Label[] = [];
  planilhasAno!: PlanilhasAno[];
  banners: Menu[] = [
    { href: '/#/planilha', icon: 'tab', label: 'Planilha' },
    { href: '/#/label', icon: 'dashboard_customize', label: 'Label' },
    { href: '/#/conta', icon: 'credit_card', label: 'Conta' },
    { href: '/#/lancamento', icon: 'add_card', label: 'Lançamento' },
    { href: '/#/extrato', icon: 'account_balance', label: 'Extrato' },
    { href: '/#/carga', icon: 'file_upload', label: 'Carga de Arquivo' }
  ];

  constructor(
    private planilhaService: PlanilhaService,
    private contaService: ContaService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {

    this.planilhaService.getMapa().subscribe(data => {
      this.planilhasAno = data;
    }, (err) => { }, () => {
      if (this.planilhasAno.length == 0) {
        this.openSnackBar('Você precisa cadastrar uma Planilha');
      } else {
        this.planilhaService.setPlanilhasAno(this.planilhasAno);

        this.planilhaService.planilhaSelecionada.subscribe(data => {
          if (data.id == undefined)
            this.planilhaService.initPlanilha(this.planilhasAno);
        });
      }
    });

  }

  private openSnackBar(msg: string) {
    this._snackBar.open(msg, 'Fechar', {
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

}
