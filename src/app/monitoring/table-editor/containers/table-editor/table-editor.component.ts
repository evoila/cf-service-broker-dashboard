import { Component, OnInit, ViewChild } from '@angular/core';
import { ESQuery } from '../../model/es-query';
import { QueryGroupComponent } from '../../components/query-group/query-group.component';

@Component({
  selector: 'sb-table-editor',
  templateUrl: './table-editor.component.html',
  styleUrls: ['./table-editor.component.scss']
})
export class TableEditorComponent implements OnInit {
  @ViewChild(QueryGroupComponent) base_query_group;

  
  query_editor_visible = false;
  query_editor_result_awaited_by_base_query_id : number = 0;
  constructor() { }

  ngOnInit() {
    
  }
  
  open_query_editor(base_query_id: number){
    /* base_query_id holds information on which base-query-input-component opened query-editor
       when query editor returns a query as result, this component manages to 'send' the resulting ESQuery to right base-query-input
       at the same time all other base-query-input rows (if any) need to have the newly created query in their query-select dropdowns */
    this.query_editor_result_awaited_by_base_query_id = base_query_id;
    this.query_editor_visible = true;
  }

  close_query_editor_component(){
    this.query_editor_visible = false;
  }

  received_query_from_q_editor(query: ESQuery){
      console.log('table-editor-container received newly created query from query editor');
      console.log(this.query_editor_result_awaited_by_base_query_id);
      this.base_query_group.receive_query_editor_result_query(query, this.query_editor_result_awaited_by_base_query_id)
  }

}
