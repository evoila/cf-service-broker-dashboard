import { Component, OnInit, Optional } from '@angular/core';
import { ColumnDefinition } from '../../model/column-definition';
import { ESBoolQueryResponse } from '../../model/es-bool-query-result';
import { Table } from 'app/monitoring/shared/model/table';
import { TableEditorComponent } from '../../containers/table-editor/table-editor.component';
import { Store } from '@ngrx/store';
import { SaveTable } from 'app/monitoring/shared/store/actions/table.actions';
import { TableModelState} from 'app/monitoring/shared/store/reducers/table.reducer';
import { filter, take } from 'rxjs/operators';
import { getTableModelState } from 'app/monitoring/shared/store/selectors/table.selector';

@Component({
  selector: 'sb-table-preview',
  templateUrl: './table-preview.component.html',
  styleUrls: ['./table-preview.component.scss']
  //providers: [TableService]
})
export class TablePreviewComponent implements OnInit {

  columnDefinitions = Array<ColumnDefinition>();
  building = true;
  data : Array<ESBoolQueryResponse>;
  table : Table;
  
  constructor( 
    @Optional() public parent: TableEditorComponent,
    private store: Store<TableModelState>) { }

  

  ngOnInit() {
  }


  public save_table(){
    const tab = new Table(this.table.title, this.columnDefinitions, this.parent.validated_scoped_selected_queries);
    console.log(tab.id);
    this.store.dispatch(new SaveTable(tab));
    this.store.select(getTableModelState).pipe(filter(k=> k.saved_table != null)).pipe(take(1)).subscribe(k=> {
        var tab = k.saved_table;
        console.log(tab);
        this.parent.saved_table_name = tab!!.title;
        this.parent.saved = true;
    });

  
  }

  public add_column(column: ColumnDefinition, data: Array<ESBoolQueryResponse>){
    this.building = true;
    this.columnDefinitions.push(column);
    this.data = data;
    this.load_table();
  }

  public drop_column(col_name: string){
    this.building = true;
    this.columnDefinitions = this.columnDefinitions.filter(col_def => col_def.name != col_name);
    if (this.columnDefinitions.length > 0){
      this.load_table();
    }
  }


  public shift_column(shift_info: [number, number] /*[index, delta]*/){
    this.building = true;
    var index = shift_info[0];
    var delta = shift_info[1];
    if(index == 0 && delta == -1){ // first column becomes last column
      const first = this.columnDefinitions.splice(0, 1);
      this.columnDefinitions = this.columnDefinitions.concat(first);
    }
    else if(index == this.columnDefinitions.length - 1 && delta == 1){ // last column becomes first column
      this.columnDefinitions = [this.columnDefinitions.pop()!!].concat(this.columnDefinitions) 
    }
    else{ 
      [this.columnDefinitions[index], this.columnDefinitions[index + delta]] = [this.columnDefinitions[index + delta], this.columnDefinitions[index]];
    }
    this.load_table();
  }

  public load_table(){
    this.table = new Table(this.table != null ? this.table.title : "Table Name", this.columnDefinitions, this.parent.validated_scoped_selected_queries)
    // refreshing Table Component by toggleing it with *ngIf --> minimal timeout needed
    setTimeout(() => {this.building = false;})
  }


  

}
