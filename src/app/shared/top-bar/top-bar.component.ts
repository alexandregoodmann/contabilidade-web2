import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {

  @Input() titulo: string;

  constructor(
    private loaderService: LoaderService,
    private location: Location,
    private router: Router
  ) { }

  ngOnInit() {
  }

  voltar() {
    //this.location.back();
    this.router.navigate(['/home']);
  }

  get loader() {
    return this.loaderService;
  }
}
