import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm = new FormGroup({
    name: new FormControl(),
    userName: new FormControl(),
    email: new FormControl(),
    password: new FormControl(),
  });
  constructor(private _user:UserService,private _route:Router) {}

  ngOnInit(): void {}
  register() {
    this._user.managerRegister(this.registerForm.value).subscribe(data=>{
      console.log(data.msg);
      localStorage.setItem('token',`${data.token}`); 
      this._route.navigate(['/home'])
    },error=>{
      console.log(error)
    })
  }
}
