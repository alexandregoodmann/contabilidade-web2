import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-lancamento-dialog',
  templateUrl: './lancamento-dialog.component.html',
  styleUrls: ['./lancamento-dialog.component.scss']
})
export class LancamentoDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    console.log('dialog', this.data);
  }

}
