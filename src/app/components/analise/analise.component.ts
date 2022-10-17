import { Component, OnInit } from '@angular/core';
import { AnaliseDTO } from 'src/app/models/analiseDTO';
import { Planilha } from 'src/app/models/planilha';
import { AnaliseService } from 'src/app/services/analise.service';
import { PlanilhaService } from 'src/app/services/planilha.service';

@Component({
  selector: 'app-analise',
  templateUrl: './analise.component.html',
  styleUrls: ['./analise.component.scss']
})
export class AnaliseComponent implements OnInit {

  colunas: string[] = ['data', 'banco', 'categoria', 'descricao', 'valor'];
  bancos!: string[];
  categorias!: string[];
  datasource!: AnaliseDTO[];

  planilhaSelecionada: Planilha = new Planilha();

  constructor(
    private analiseService: AnaliseService,
    private planilhaService: PlanilhaService
  ) { }

  ngOnInit(): void {
    this.planilhaService.planilhaSelecionada.subscribe(data => {
      this.planilhaSelecionada = data;
      this.getAnalise();
    });

  }

  getAnalise() {
    this.analiseService.getAnaliseAno(this.planilhaSelecionada.ano).subscribe(data => {
      this.datasource = data as AnaliseDTO[];
      this.bancos = [...new Set(this.datasource.map(n => n.banco))];
      this.categorias = [...new Set(this.datasource.map(n => n.categoria))];
      console.log('bancos', this.bancos);
      console.log('categorias', this.categorias);

    });
  }

}