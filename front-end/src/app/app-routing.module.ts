import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LogedGuard } from './guards/loged.guard';
import { NotlogedGuard } from './guards/notloged.guard';
import { AddCompanyComponent } from './pages/add-company/add-company.component';
import { AddEmployeeComponent } from './pages/add-employee/add-employee.component';
import { ChatComponent } from './pages/chat/chat.component';
import { CompanyComponent } from './pages/company/company.component';
import { EmployeeComponent } from './pages/employee/employee.component';
import { HomeComponent } from './pages/home/home.component';
import { LandingComponent } from './pages/landing/landing.component';
import { LoginComponent } from './pages/login/login.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { RegisterComponent } from './pages/register/register.component';

const routes: Routes = [
  {path:'home',component:HomeComponent,canActivate:[LogedGuard]},
  {path:'',component:LandingComponent,canActivate:[NotlogedGuard]},
  {path:'register',component:RegisterComponent,canActivate:[NotlogedGuard]},
  {path:'login',component:LoginComponent,canActivate:[NotlogedGuard]},
  {path:'employee/:id',component:EmployeeComponent,canActivate:[LogedGuard,AuthGuard]},
  // {path:'employee/add',component:AddEmployeeComponent,canActivate:[AuthGuard]},
  {path:'company/add',component:AddCompanyComponent,canActivate:[LogedGuard,AuthGuard]},
  {path:'company/:id',component:CompanyComponent,canActivate:[LogedGuard,AuthGuard]},
  {path:'live-chat/:id',component:ChatComponent,canActivate:[NotlogedGuard]},
  {path:'404',component:NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
