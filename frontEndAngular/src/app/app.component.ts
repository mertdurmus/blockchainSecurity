import { Component, OnInit } from '@angular/core';
import { BlockService } from './services/block.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'blockchainFrontEnd';
  login;

  constructor(private service: UserService) {}

  ngOnInit(): void {

    if (this.service.isUserLoggedIn) {
      this.login = true;
    } else {
      this.login = false;
    }
  }
  logout(){
    this.service.logout();
    this.login = false;
    // this.refresh();
  }
  
  
  refresh(): void {
    window.location.reload();
}

}
