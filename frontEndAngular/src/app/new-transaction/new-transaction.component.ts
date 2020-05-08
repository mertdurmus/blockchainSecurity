import { Component, OnInit } from '@angular/core';
import { BlockService } from '../services/block.service';
import { transaction } from '../models/transaction';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-transaction',
  templateUrl: './new-transaction.component.html',
  styleUrls: ['./new-transaction.component.css']
})
export class NewTransactionComponent implements OnInit {

  dataa: transaction;
  TransactionForm: FormGroup;
  showMsg;
  constructor(private service: BlockService, private formBuilder: FormBuilder, private router: Router) { }

  createForm() {

    this.TransactionForm = this.formBuilder.group({
      author: ['', Validators.required],
      content: ['', Validators.required]
    });
  }

  sendTransaction() {
    this.dataa = Object.assign({}, this.TransactionForm.value);
    this.service.setTransaction(this.dataa).subscribe(
      data => {
        this.showMsg = true;
        this.createForm();
        // setTimeout(() => {this.showMsg = false; this.router.navigate(['get']); }, 2500);
      },
      error => console.log(error));
  }


ngOnInit() {
    this.createForm();
  }

}
