import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { user } from '../models/user';
import { Router } from '@angular/router';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';



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


  constructor(private service: UserService, private formBuilder: FormBuilder, private router: Router ) { }

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
  sendUser() {
    this.User = Object.assign({}, this.registerForm.value);
    this.service.register(this.User).subscribe(
      data => {
        this.createForm();
        this.showMsg = true;
        // setTimeout(() => {this.showMsg = false; }, 2500);
        setTimeout(() => {this.showMsg = false; this.router.navigate(['login']); }, 2500);
      },
      error => console.log(error));
  }

  btnClick () {
    this.router.navigateByUrl('/login');
};

  ngOnInit() {
    this.createForm();
    if (this.service.isUserLoggedIn()) {
      this.showMsglogin = true;
      setTimeout(() => {this.showMsg = false; this.router.navigate(['main']); }, 3500);
    }

  }

}

