import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private _user:UserService) { }

  ngOnInit(): void {
  }
  logout(){
    this._user.logOut().subscribe(data=>{
      console.log(data);
      localStorage.removeItem('token')
    })
  }
}
