import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { user } from '../models/user';
import { Router } from '@angular/router';



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  User: user;
  registerForm: FormGroup;
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
        // setTimeout(() => {this.showMsg = false; this.router.navigate(['get']); }, 2500);
      },
      error => console.log(error));
  }

  btnClick () {
    this.router.navigateByUrl('/login');
};

  ngOnInit() {
    this.createForm();
  }

}

