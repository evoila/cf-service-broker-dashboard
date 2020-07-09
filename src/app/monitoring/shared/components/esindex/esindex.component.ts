import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

@Component({
  selector: 'sb-esindex',
  templateUrl: './esindex.component.html',
  styleUrls: ['./esindex.component.scss']
})
export class EsindexComponent implements OnInit {

  @Output('index')
  index = new EventEmitter<string>();

  @Input('indexList')
  esIndexes = Array<string>();
  
  choosen: number = -1;
 
  constructor() { }


  ngOnInit(): void {


  }


  
  public setChoosen() {
    this.index.next(this.esIndexes[this.choosen]);
  }


}
