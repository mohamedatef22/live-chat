import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    user: new FormControl(),
    password: new FormControl(),
  });
  constructor(private _user:UserService,private _route:Router) {}

  ngOnInit(): void {}
  login(){
    console.log(this.loginForm.value)
    this._user.login(this.loginForm.value).subscribe(data=>{
      console.log(data.msg);
      localStorage.setItem('token',`${data.token}`);
      sessionStorage.setItem('user',JSON.stringify(data.data))
      this._route.navigate(['/home'])
    },error=>{
      console.log(error)
    })
  }
}
