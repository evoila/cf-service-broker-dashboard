import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'sb-elasticsearch-backup',
  templateUrl: './elasticsearch-backup.component.html',
  styleUrls: ['./elasticsearch-backup.component.scss']
})
export class ElasticsearchBackupComponent implements OnInit {
  readonly formElements: Array<string> = ["backup"];
  readonly instanceGroupName: string = "elasticsearch";

  constructor() { }

  ngOnInit() { }

}