import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  emp
  id
  constructor(private _user:UserService,private _activated:ActivatedRoute,private _router:Router) { }

  ngOnInit(): void {
    this.emp = history.state;
    this.id = this._activated.snapshot.paramMap.get('id')
    if(!("emp" in this.emp)){
      this._user.getEmployee(this.id).subscribe(data=>{
        this.emp.emp = data.data
      })
    }
  }
  changeStatus(){
    if(this.emp.emp.status){
      this._user.deactivateEmployee(this.id).subscribe(data=>{
        this.emp.emp = data.data
      })
    }
    else{
      this._user.activateEmployee(this.id).subscribe(data=>{
        this.emp.emp = data.data
      })
    }
  }

  deleteEmp(){
    const companyID = this.emp.emp.company_id
    this._user.deleteEmployee(this.id).subscribe(data=>{
      console.log(data)
      this._router.navigate([`/company/${companyID}`])
    })
  }
}
