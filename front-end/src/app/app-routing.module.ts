import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddCompanyComponent } from './pages/add-company/add-company.component';
import { AddEmployeeComponent } from './pages/add-employee/add-employee.component';
import { CompanyComponent } from './pages/company/company.component';
import { EmployeeComponent } from './pages/employee/employee.component';
import { HomeComponent } from './pages/home/home.component';
import { LandingComponent } from './pages/landing/landing.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';

const routes: Routes = [
  {path:'home',component:HomeComponent},
  {path:'',component:LandingComponent},
  {path:'register',component:RegisterComponent},
  {path:'login',component:LoginComponent},
  {path:'employee/:id',component:EmployeeComponent},
  {path:'employee/add',component:AddEmployeeComponent},
  {path:'company/add',component:AddCompanyComponent},
  {path:'company/:id',component:CompanyComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
