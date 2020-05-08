import { Component, OnInit } from '@angular/core';
import { BlockService } from '../services/block.service';
import { block } from '../models/block';

@Component({
  selector: 'app-chain',
  templateUrl: './chain.component.html',
  styleUrls: ['./chain.component.css']
})
export class ChainComponent implements OnInit {


  blocks: block[];
  constructor(private service: BlockService) { }

  ngOnInit() {

    this.service.getBlocks().subscribe(data => {
      this.blocks = data;
    });
    // console.log(this.blocks)
  }

}
