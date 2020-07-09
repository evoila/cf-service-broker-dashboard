import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

@Component({
  selector: 'sb-esindex',
  templateUrl: './esindex.component.html',
  styleUrls: ['./esindex.component.scss']
})
export class EsindexComponent implements OnInit {
  // Returns choosen ES-Index with Wildcard so that the missing Dates are ignored
  @Output('index')
  index = new EventEmitter<string>();
  // Returns choosen ES-Index without the necessary date-prefix 
  @Output('rawIndex')
  rawIndex = new EventEmitter<string>();


  esIndexes = Array<string>();

  @Input('indexList')
  set indexList(esIndexes: Array<string>) {
    
    this.esIndexes = esIndexes.sort();
    if (esIndexes && esIndexes.length) {
      this.choosen = 0;
      this.index.next("*-" + esIndexes[0]);
      this.rawIndex.next(esIndexes[0]);
    }
  }

  choosen: number = -1;

  constructor() { }


  ngOnInit(): void {


  }


  public setChoosen() {
    this.index.next("*-" + this.esIndexes[this.choosen]);
    this.rawIndex.next(this.esIndexes[this.choosen]);
  }


}
