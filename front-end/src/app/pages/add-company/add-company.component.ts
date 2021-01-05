import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { CompanyService } from 'src/app/services/company.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-add-company',
  templateUrl: './add-company.component.html',
  styleUrls: ['./add-company.component.css']
})
export class AddCompanyComponent implements OnInit {
  addCompanyForm = new FormGroup({
    name: new FormControl(),
  });
  user
  constructor(private _user:UserService,private _company:CompanyService,private _router:Router) { 
    this._user.authMe().subscribe(data=>{
      console.log(data);
      this.user = data
    })
  }

  ngOnInit(): void {
  }

  addCompany(){
    this.addCompanyForm.value.manager_id = this.user._id
    this._company.addCompany(this.addCompanyForm.value).subscribe(data=>{
      console.log(data);
      this._router.navigate(['/home'])
    })
  }
}
