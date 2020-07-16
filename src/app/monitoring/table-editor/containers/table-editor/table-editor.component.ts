import { Component, OnInit, ViewChild } from '@angular/core';
import { ESQuery } from '../../model/es-query';
import { GetESQueriesState } from '../../store/reducers/query.reducer';
import * as fromQueries from '../../store/actions/query.action';

import { Store } from '@ngrx/store';
import { ColumnDefinition } from '../../model/column-definition';
import { BaseQueryInputComponent } from '../../components/base-query-input/base-query-input.component';
import { TablePreviewComponent } from '../../components/table-preview/table-preview.component';
import { getQueriesState } from '../../store';
import { filter, take } from 'rxjs/operators';
import { forwardRef } from '@angular/core';
import { ESQuery_Request } from '../../model/es-query-request';

@Component({
  selector: 'sb-table-editor',
  templateUrl: './table-editor.component.html',
  styleUrls: ['./table-editor.component.scss']
})
export class TableEditorComponent implements OnInit {
  @ViewChild(BaseQueryInputComponent) base_query_input;
  @ViewChild(forwardRef(() => TablePreviewComponent)) table_preview;

  // avialable data example ( 1 hit )
  data = {};
  // raw data contains all hits
  raw_data: Array<any>;
  // all queries data basement is build of key: query ID, val: query Request
  validated_scoped_selected_queries = Array<ESQuery_Request>();

  col_def_component_visible = false;
  query_editor_visible = false;
  saved = false;
  saved_table_name = "";
  

  constructor(private store: Store<GetESQueriesState>
              ) { }

  ngOnInit() {
    //loading stored Elastic Bool Queries from db into ngrx store
    this.store.dispatch(new fromQueries.LoadQueries());
  }
  



  close_column_definer(){
    this.col_def_component_visible = false;
  }

  open_column_definer(){
    // getting data from store
    this.store.select(getQueriesState).pipe(filter(k => !k.queries.running)).pipe(take(1)).subscribe(k => {

        // remembering this querys Request (query + scope + auth) before we build a table from its result
        this.validated_scoped_selected_queries = this.validated_scoped_selected_queries.concat( k.queries.bc_request!! );   // [k.queries.run_result!!.queryId] = ;
        // caching all hits from query result to show preview data
        this.raw_data = k.queries.run_result!!.responses[0].hits.hits;
        // taking the first hit of last run bool query result as an example for which keys can be selected
        this.data = {...this.data,...this.raw_data[0]._source};
        
    })
    this.col_def_component_visible = true;
  }

  open_query_editor(base_query_id: number){
    /* base_query_id holds information on which base-query-input-component opened query-editor
       when query editor returns a query as result, this component manages to 'send' the resulting ESQuery to right base-query-input
       at the same time all other base-query-input rows (if any) need to have the newly created query in their query-select dropdowns */
    
    this.query_editor_visible = true;
  }

  close_query_editor_component(){
    this.query_editor_visible = false;
  }

  received_query_from_q_editor(query: ESQuery){
      //console.log('table-editor-container received newly created query from query editor');
      //console.log(this.query_editor_result_awaited_by_base_query_id);
      this.base_query_input.receive_query_editor_result_query(query, 0)
  }

  public update_column(column: ColumnDefinition){
    this.table_preview.add_column(column, this.raw_data);
  }

  public reset_table_editor(){
    this.data = {};
    this.raw_data = Array<any>();
    this.validated_scoped_selected_queries = [];
    this.col_def_component_visible = false;
    this.query_editor_visible = false;
    this.saved = false;
  }
  

}
