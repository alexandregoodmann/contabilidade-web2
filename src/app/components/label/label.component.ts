import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
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
  displayedColumns: string[] = ['descricao', 'analisar', 'chaves', 'delete'];
  chaves: Set<string> = new Set<string>();

  constructor(
    private fb: FormBuilder,
    private labelService: LabelService
  ) { }

  ngOnInit() {
    this.group = this.fb.group({
      descricao: [null, [Validators.required]],
      analisar: [null],
      chaves: [null]
    });
    this.findAll();
  }

  salvar() {

    let _value = '';
    this.chaves.forEach(e => {
      _value = (_value.length == 0) ? e : _value.concat(";").concat(e);
    });
    this.group.get('chaves')?.setValue(_value);

    if (this.categoria == undefined) {
      this.labelService.create(this.group.value).subscribe(() => { }, () => { }, () => {
        this.findAll();
        this.chaves = new Set<string>();
      });
    } else {
      let model = this.group.value;
      model.id = this.categoria.id;
      this.labelService.update(this.group.value).subscribe(() => { }, () => { }, () => {
        this.categoria = undefined;
        this.group.reset();
        this.findAll();
        this.chaves = new Set<string>();
      });
    }

  }

  findAll() {
    this.labelService.findAll().subscribe(data => {
      this.categorias = data as unknown as Label[];
    });
  }

  edit(obj: Label) {
    if (obj.chaves != '')
      obj.chaves.split(';').forEach(e => { this.chaves.add(e) });
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

  addChave(event: MatChipInputEvent) {
    if (event.value) {
      this.chaves.add(event.value);
      event.chipInput!.clear();
    }
  }

  removeChave(chave: string) {
    this.chaves.delete(chave);
  }
}
