import { Component, OnInit } from '@angular/core';
import { SidebarEntry } from 'app/core/sidebar';

@Component({
  selector: 'sb-elasticsearch',
  templateUrl: './elasticsearch.component.html',
  styleUrls: ['./elasticsearch.component.scss']
})
export class ElasticsearchComponent implements OnInit {
  menu: SidebarEntry[] = [{
    name: 'Configuration',
    isCollapsible: true,
    links: [{
      name: 'Endpoints',
      href: '/elasticsearch/elasticsearch-backup',
      iconClass: 'fas fa-tachometer-alt'
    }]
  }];

  constructor() { }

  ngOnInit() {}
  
}
