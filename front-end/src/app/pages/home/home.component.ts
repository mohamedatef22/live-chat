import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  type:Boolean
  constructor() { }

  ngOnInit(): void {
    this.type = JSON.parse(sessionStorage.getItem('user')).type
  }

}
