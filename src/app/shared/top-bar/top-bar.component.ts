import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent {

  @Input()
  titulo: string = '';

  constructor(
    private loaderService: LoaderService,
    private router: Router
  ) { }

  voltar() {
    this.router.navigate(['/home']);
  }

  get loader() {
    return this.loaderService;
  }
}
