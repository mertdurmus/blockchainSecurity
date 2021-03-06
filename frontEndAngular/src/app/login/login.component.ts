import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  
  username = '';
  passwd = '';
  loginForm: FormGroup;
  showMsg;


  constructor(private service: UserService, private formBuilder: FormBuilder, private router: Router) { }


  createForm() {

    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      passwd: ['', Validators.required]

    });
  }

  login() {
    this.service.login(this.username, this.passwd).subscribe(
      data => {
         this.showMsg = true;
         setTimeout(() => {this.showMsg = false; this.router.navigate(['chain']); }, 2500);
      },
      error => {
        console.log(error);

      }
    );

  }

  ngOnInit() {
    this.createForm();
  }

}
