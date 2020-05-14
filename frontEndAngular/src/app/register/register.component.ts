import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { user } from '../models/user';
import { Router } from '@angular/router';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { IpServiceService } from '../services/ip-service.service';
import { HttpClient } from '@angular/common/http';



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  User: user;
  registerForm: FormGroup;
  showMsg;
  showMsglogin;
  username1: string;
  ipAddress: any;
  privateIP;
  mesaj;



  // tslint:disable-next-line:max-line-length
  constructor(private service: UserService, private formBuilder: FormBuilder, private router: Router, private ipService: IpServiceService, private http: HttpClient ) { }

  createForm() {

    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      phone: ['', Validators.required],
      tc: ['', Validators.required],
      username: ['', Validators.required],
      passwd: ['', Validators.required]
    });
  }
  async sendUser() {
    this.User = Object.assign({}, this.registerForm.value);
    this.service.register(this.User).subscribe(
      data => {
        this.createForm();
        this.showMsg = true;
        this.mesaj = data;
        // setTimeout(() => {this.showMsg = false; }, 2500);
        setTimeout(() => {this.showMsg = false; }, 4000);
      },
      error => console.log(error));
    this.username1 = this.User.username;
    this.getIP();
    await this.delay(3000);
    console.log(this.ipAddress);
    this.ipService.setİpAdress(this.username1, this.ipAddress).subscribe((res: any) =>  {
      console.log(JSON.stringify(res));
    });
  }

  btnClick() {
    this.router.navigateByUrl('/login');
};

  ngOnInit() {

    this.createForm();
    if (this.service.isUserLoggedIn()) {
      this.showMsglogin = true;
      setTimeout(() => {this.showMsg = false; this.router.navigate(['main']); }, 3500);
    }

  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

  getIP() {

    this.ipService.getIPAddress().subscribe((res: any) =>  {
      this.ipAddress = res.ip;
      console.log(res.ip);
      console.log(JSON.stringify(res));
    });
  }
}

