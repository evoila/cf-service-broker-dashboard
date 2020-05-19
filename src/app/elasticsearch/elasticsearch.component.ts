import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'sb-elasticsearch',
  templateUrl: './elasticsearch.component.html',
  styleUrls: ['./elasticsearch.component.scss']
})
export class ElasticsearchComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    console.log("some Module");
  }

}
