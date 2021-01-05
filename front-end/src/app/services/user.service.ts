import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  BASE_URL = 'http://localhost:3000'
  constructor(private _http:HttpClient) { }

  managerRegister(form):Observable<any>{
    return this._http.post(`${this.BASE_URL}/m/register`,form)
  }

  addEmployee(form):Observable<any>{
    return this._http.post(`${this.BASE_URL}/m/employee/add`,form)
  }
  login(form):Observable<any>{
    return this._http.post(`${this.BASE_URL}/login`,form)
  }

  deleteManager(id):Observable<any>{
    return this._http.delete(`${this.BASE_URL}/m/delete/${id}`)
  }

  deleteEmployee(id):Observable<any>{
    return this._http.delete(`${this.BASE_URL}/m/employee/delete/${id}`)
  }

  getEmployee(id):Observable<any>{
    return this._http.get(`${this.BASE_URL}/m/employee/view/${id}`)
  }

  authMe():Observable<any>{
    return this._http.get(`${this.BASE_URL}/me`)
  }

  activateEmployee(id):Observable<any>{
    return this._http.post(`${this.BASE_URL}/m/employee/activate/${id}`,null)
  }
  deactivateEmployee(id):Observable<any>{
    return this._http.post(`${this.BASE_URL}/m/employee/deactivate/${id}`,null)
  }

  logOut():Observable<any>{
    return this._http.get(`${this.BASE_URL}/logout`)
  }
}
