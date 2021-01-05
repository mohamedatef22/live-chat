import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent implements OnInit {
  addEmployeeForm = new FormGroup({
    name: new FormControl(),
    userName: new FormControl(),
    email: new FormControl(),
    password: new FormControl(),
  });
  constructor() { }

  ngOnInit(): void {
  }
  addEmployee(){
    
  }
}
