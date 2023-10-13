import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Planilha } from 'src/app/models/planilha';
import { ResumoExtrato } from 'src/app/models/resumo-extrato';
import { AnaliseService } from 'src/app/services/analise.service';
import { PlanilhaService } from 'src/app/services/planilha.service';

@Component({
  selector: 'app-resumo-extrato',
  templateUrl: './resumo-extrato.component.html',
  styleUrls: ['./resumo-extrato.component.scss']
})
export class ResumoExtratoComponent implements OnInit {

  displayedColumns: string[] = ['conta', 'lancamento', 'valor', 'porcentagem'];
  dataSource = new MatTableDataSource<ResumoExtrato>();

  planilhaSelecionada!: Planilha;
  resumoExtrato: ResumoExtrato[] = [];

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private analiseService: AnaliseService,
    private planilhaService: PlanilhaService,
    private _liveAnnouncer: LiveAnnouncer
  ) { }

  ngOnInit(): void {
    this.planilhaService.planilhaSelecionada.subscribe(data => { this.planilhaSelecionada = data });
    this.analiseService.getResumoExtrato(this.planilhaSelecionada.ano, this.planilhaSelecionada.mes).subscribe(data => {
      this.resumoExtrato = data;
      this.dataSource = new MatTableDataSource(this.resumoExtrato);
    });
  }

  announceSortChange(sortState: Sort) {
    this.dataSource.sort = this.sort;
  }

}
