import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private _user:UserService,private _router:Router) { }

  ngOnInit(): void {
  }
  logout(){
    this._user.logOut().subscribe(data=>{
      console.log(data);
      localStorage.removeItem('token')
      this._router.navigate(['/'])
    })
  }
}
