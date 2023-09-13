import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Label } from 'src/app/models/label';
import { LabelService } from 'src/app/services/label.service';

@Component({
  selector: 'app-categoria',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.css']
})
export class LabelComponent implements OnInit {

  categoria?: Label;
  group!: FormGroup;
  categorias!: Array<Label>;
  displayedColumns: string[] = ['descricao', 'analisar', 'delete'];

  constructor(
    private fb: FormBuilder,
    private labelService: LabelService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.group = this.fb.group({
      descricao: [null, [Validators.required]],
      analisar: [null]
    });
    this.findAll();
  }

  salvar() {
    if (this.categoria == undefined) {
      this.labelService.create(this.group.value).subscribe(() => { }, () => { }, () => { this.findAll(); });
    } else {
      let model = this.group.value;
      model.id = this.categoria.id;
      this.labelService.update(this.group.value).subscribe(() => { }, () => { }, () => {
        this.categoria = undefined;
        this.group.reset();
        this.findAll();
      });
    }
  }

  findAll() {
    this.labelService.findAll().subscribe(data => {
      this.categorias = data as unknown as Label[];
    });
  }

  edit(obj: Label) {
    this.categoria = obj;
    this.group.patchValue(obj);
  }

  delete(id: number) {
    this.labelService.delete(id).subscribe({
      complete: () => {
        this.categoria = undefined;
        this.group.reset();
        this.findAll();
      }
    });
  }

}
