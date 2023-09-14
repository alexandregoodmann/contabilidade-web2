import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Label } from 'src/app/models/label';
import { LabelService } from 'src/app/services/label.service';

@Component({
  selector: 'app-chips',
  templateUrl: './chips.component.html',
  styleUrls: ['./chips.component.scss']
})
export class ChipsComponent implements OnInit {

  @Input() label!: string;
  @Output() emitter = new EventEmitter<Label[]>();
  
  group!: FormGroup;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredLabels: Label[] = [];
  labels: Label[] = [];
  allLabels: Label[] = [];

  constructor(
    private labelService: LabelService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {

    this.findAll();
    this.group = this.fb.group({
      label: [null]
    });

    this.group.get('label')?.valueChanges.subscribe(data => {
      let search = (data == null || data == undefined) ? '' : data;
      if (search.id == undefined)
        this.filteredLabels = this.allLabels.filter(o => o.descricao.toLowerCase().includes(search.toLowerCase()));
    });
  }

  findAll() {
    this.labelService.findAll().subscribe(data => {
      this.allLabels = data as unknown as Label[];
    });
  }

  add(event: MatChipInputEvent): void {
    if (event.value != undefined && event.value != '') {
      let temp = new Label();
      temp.descricao = event.value;
      this.labels.push(temp);
      this.emitter.emit(this.labels);
    }
  }

  remove(label: Label): void {
    const index = this.labels.indexOf(label);
    if (index >= 0) {
      this.labels.splice(index, 1);
    }
    this.emitter.emit(this.labels);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.labels.push(event.option.value);
    this.emitter.emit(this.labels);
  }

}
