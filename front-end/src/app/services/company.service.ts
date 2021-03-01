import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  BASE_URL = 'http://localhost:3000'
  constructor(private _http:HttpClient) { }

  addCompany(form):Observable<any>{
    return this._http.post(`${this.BASE_URL}/c/add`,form)
  }

  getCompany(id):Observable<any>{
    return this._http.get(`${this.BASE_URL}/c/view/${id}`)
  }

  serveCustomer(id,socketId):Observable<any>{
    return this._http.post(`${this.BASE_URL}/c/e/live/${id}`,{socketId:socketId})
  }

  addCustomer(form,id):Observable<any>{
    return this._http.post(`${this.BASE_URL}/c/c/live/${id}`,form)
  }

  getCompanies():Observable<any>{
    return this._http.get(`${this.BASE_URL}/c/all`)
  }

  deleteCompanies(id):Observable<any>{
    return this._http.delete(`${this.BASE_URL}/c/delete/${id}`)
  }

  
}
