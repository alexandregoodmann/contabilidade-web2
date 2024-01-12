import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatChip } from '@angular/material/chips';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MESES } from 'src/app/app.module';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-carga-anual',
  templateUrl: './carga-anual.component.html',
  styleUrls: ['./carga-anual.component.scss']
})
export class CargaAnualComponent implements OnInit {

  fileName = '';
  file!: File;
  meses = MESES;
  group!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.group = this.fb.group({
      mes: [null, [Validators.required]]
    });
   }

  onFileSelected(event: any) {
    this.file = event.target.files[0];
    this.fileName = this.file.name;
  }

  enviar() {
    const formData = new FormData();
    formData.append("titulo", this.data);
    formData.append("mes", this.group.get('mes')?.value.mes);
    formData.append("file", this.file);
    this.http.post(`${environment.url}/planilhaanual/uploadFile`, formData).subscribe(() => {
    });
  }

  setMes(chip: MatChip) {
    chip.toggleSelected();
    this.group.get('mes')?.setValue(chip.value);
  }
}
