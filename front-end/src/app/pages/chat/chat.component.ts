import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';
import { ChatService } from 'src/app/services/chat.service';
import { CompanyService } from 'src/app/services/company.service';
const SOCKET_ENDPOINT = 'localhost:3000';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  chatStarted:boolean = false;
  socket;
  chatId;
  employeeSocketId;
  messages:[] = [];
  addCustomerForm = new FormGroup({
    userName: new FormControl()
  });
  constructor(private _company:CompanyService,private _router:ActivatedRoute,private _chat:ChatService,private __router:Router) { }

  ngOnInit(): void {
    // console.log(sessionStorage.getItem('user'));
    this.setupSocket()
    this.getMessages()
      .subscribe((message) => {
        // console.log(message);

      });
  }
  addCustomer(){
    this.addCustomerForm.value.customerSocketId = this.socket.id
    // console.log(this.addCustomerForm.value);
    this._company.addCustomer(this.addCustomerForm.value,this._router.snapshot.paramMap.get('id')).subscribe(data=>{
      this.chatId = data.data[0]._id
    },e=>{
      // console.log(e);
      if(e.error.msg == "not found"){
        this.__router.navigate(['/404'])
      }
    })
  }
  setupSocket() {
    this.socket = io(`${SOCKET_ENDPOINT}/connectMe`)
    // console.log(this.socket);
  }

  sendMessage(message){
    this._chat.clientSendMessage({message:message},this.chatId).subscribe(data=>{
      // console.log(data);
      // this.messages.push({sender:false,message:message})
    })
  }
  getMessages = () => {
    return Observable.create((observer) => {
      this.socket.on('new-message', (message) => {
        this.messages = message
        observer.next(message);
      });
      this.socket.on('chat-started',(employeeSocketId) => {
        this.employeeSocketId = employeeSocketId
        this.chatStarted = true;
        observer.next(employeeSocketId);
      });
    });
  }
}
