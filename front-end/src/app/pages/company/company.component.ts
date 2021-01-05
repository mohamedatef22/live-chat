import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from 'src/app/services/company.service';
import { UserService } from 'src/app/services/user.service';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css'],
})
export class CompanyComponent implements OnInit {
  companies;
  id;
  employess = [];
  @ViewChild('closeButton') closebutton;
  registerForm = new FormGroup({
    name: new FormControl(),
    userName: new FormControl(),
    email: new FormControl(),
    password: new FormControl(),
  });
  @Input() flag: Boolean = false; // for all companies or one company
  constructor(
    private _company: CompanyService,
    private _activatedRoute: ActivatedRoute,
    private _user: UserService,
    private _route:Router
  ) {}

  ngOnInit(): void {
    if (this.flag) {
      this._company.getCompanies().subscribe(
        (data) => {
          this.companies = data.data;
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      // complete else
      this.id = this._activatedRoute.snapshot.paramMap.get('id');
      this._company.getCompany(this.id).subscribe(
        (data) => {
          this.companies = data.data.company;
          data.data.employess.forEach((element) => {
            this._user.getEmployee(element.employee_id).subscribe(
              (data) => {
                this.employess.push(data.data);
              },
              (error) => {
                console.log(error);
              }
            );
          });
        },
        (error) => {
          console.log(error);
          // redirect to 404
        }
      );
    }
  }
  register() {
    this.registerForm.value.company_id = this.id;
    this._user.addEmployee(this.registerForm.value).subscribe(
      (data) => {
        this.employess.push(data.data);
        this.closebutton.nativeElement.click();
        this.registerForm.reset()
        // this._route.navigate(['/home'])
      },
      (error) => {
        console.log(error);
      }
    );
  }
  deleteCompany(){
    this._company.deleteCompanies(this.id).subscribe(data=>{
      console.log(data);
      this._route.navigate(['/home'])      
    })
  }
}
