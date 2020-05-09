import { Component, OnInit } from '@angular/core';
import { BlockService } from '../services/block.service';

@Component({
  selector: 'app-mining',
  templateUrl: './mining.component.html',
  styleUrls: ['./mining.component.css']
})
export class MiningComponent implements OnInit {

  constructor(private service: BlockService) { }

  msg;

  ngOnInit() {
    this.service.getMine().subscribe(data => {
      this.msg = data;
    });
    // this.msg = this.service.mesaj;
  }
  }


