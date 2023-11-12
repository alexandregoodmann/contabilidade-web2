import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-check',
  templateUrl: './check.component.html',
  styleUrls: ['./check.component.scss']
})
export class CheckComponent implements OnInit {

  @Input() icon!: string;
  @Input() checked: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
