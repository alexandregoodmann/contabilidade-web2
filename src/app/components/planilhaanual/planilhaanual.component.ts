import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-planilhaanual',
  templateUrl: './planilhaanual.component.html',
  styleUrls: ['./planilhaanual.component.scss']
})
export class PlanilhaanualComponent implements OnInit {

  @Input() planilha: any;

  group!: FormGroup;
  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.group = this.fb.group({
      descricao: [null, [Validators.required]]
    });

    this.group.get('descricao')?.setValue(this.planilha);
  }

  salvar() {
    console.log(this.group);

  }
}
