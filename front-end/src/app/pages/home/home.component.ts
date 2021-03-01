import {
  Component,
  OnInit
} from '@angular/core';
import {
  Observable
} from 'rxjs';
import {
  io
} from 'socket.io-client';
import { ChatService } from 'src/app/services/chat.service';
import { CompanyService } from 'src/app/services/company.service';
const SOCKET_ENDPOINT = 'localhost:3000';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  type: Boolean
  socket;
  chat;
  constructor(private _comp:CompanyService,private _chat:ChatService) {}
  ngOnInit(): void {
    this.type = JSON.parse(sessionStorage.getItem('user')).type
    console.log(sessionStorage.getItem('user'));
    this.setupSocket()
    this.getMessages()
      .subscribe((message) => {
        console.log(message);

      });
  }

  setupSocket() {
    this.socket = io(`${SOCKET_ENDPOINT}/connectMe`)
    console.log(this.socket);

  }
  sendMessage(message) {
    console.log(message);
    this._chat.employeeSendMessage({message:message},this.chat._id).subscribe(data=>{
      console.log(data);
    })
  }
  getMessages = () => {
    return Observable.create((observer) => {
      this.socket.on('new-message', (message) => {
        observer.next(message);
      });
    });
  }

  serve(){
    this._comp.serveCustomer(JSON.parse(sessionStorage.getItem('user')).company_id,this.socket.id).subscribe(data=>{
      console.log(data);
      this.chat = data.data[1]
    })
  }
}
