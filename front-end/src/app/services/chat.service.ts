import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  BASE_URL = 'http://localhost:3000'
  constructor(private _http:HttpClient) { }
  
  clientSendMessage(form,id):Observable<any>{    
    return this._http.post(`${this.BASE_URL}/chat/${id}/customer/message`,form)
  }

  employeeSendMessage(form,id):Observable<any>{
    return this._http.post(`${this.BASE_URL}/chat/${id}/employee/message`,form)
  }

}
