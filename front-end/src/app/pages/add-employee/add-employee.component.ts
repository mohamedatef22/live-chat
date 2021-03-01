import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CompanyService } from 'src/app/services/company.service';
import { io } from 'socket.io-client';
import { ChatService } from 'src/app/services/chat.service';
import { Observable } from 'rxjs';
const SOCKET_ENDPOINT = 'localhost:3000';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent implements OnInit {
  // addEmployeeForm = new FormGroup({
  //   name: new FormControl(),
  //   userName: new FormControl(),
  //   email: new FormControl(),
  //   password: new FormControl(),
  // });
  // socket;
  // chatId;
  // employeeSocketId;
  // messages;
  // addCustomerForm = new FormGroup({
  //   userName: new FormControl()
  // });
  // constructor(private _company:CompanyService,private _router:ActivatedRoute,private _chat:ChatService) { }
  constructor(){}
  ngOnInit(): void{}
  // ngOnInit(): void {
  //   console.log(sessionStorage.getItem('user'));
  //   this.setupSocket()
  //   this.getMessages()
  //     .subscribe((message) => {
  //       console.log(message);

  //     });
  // }
  // addCustomer(){
  //   this.addCustomerForm.value.customerSocketId = this.socket.id
  //   console.log(this.addCustomerForm.value);
  //   this._company.addCustomer(this.addCustomerForm.value,this._router.snapshot.paramMap.get('id')).subscribe(data=>{
  //     this.chatId = data.data[0]._id
  //     console.log(this.chatId);      
  //   })
  // }
  // setupSocket() {
  //   this.socket = io(`${SOCKET_ENDPOINT}/connectMe`)
  //   console.log(this.socket);
  // }

  // sendMessage(message){
  //   this._chat.clientSendMessage({message:message},this.chatId).subscribe(data=>{
  //     console.log(data);
  //   })
  // }
  // getMessages = () => {
  //   return Observable.create((observer) => {
  //     this.socket.on('new-message', (message) => {
  //       this.messages = message
  //       observer.next(message);
  //     });
  //     this.socket.on('chat-started',(employeeSocketId) => {
  //       this.employeeSocketId = employeeSocketId
  //       observer.next(employeeSocketId);
  //     });
  //   });
  // }
}
