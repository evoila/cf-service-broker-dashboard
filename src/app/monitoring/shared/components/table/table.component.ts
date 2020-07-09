import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Table } from '../../model/table';
import { ESBoolQueryResponse } from '../../../table-editor/model/es-bool-query-result';
import { ColumnDefinition } from 'app/monitoring/table-editor/model/column-definition';



@Component({
  selector: 'sb-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {


  @Output('drop_col')
  drop_col = new EventEmitter<string>();

  @Output('shift_col')  // [column index, shift direction]
  shift_col = new EventEmitter<[number, number]>();
  /*
    @Output('rename_col')
    rename_col = new EventEmitter<string>();
  */
  @Input('table')
  table: Table;

  @Input('es_data')
  es_data: Array<ESBoolQueryResponse>;

  @Input('editor_mode')
  is_editor_mode: boolean;



  constructor() { }

  tableName = "";
  table_content = Array<Array<String>>();
  table_header = Array<String>();
  rendering = true;


  ngOnInit() {
    this.updateTable();
  }



  private updateTable(): void {
    // building 2 dim array to carry table data
    //console.log('BUILDING TABLE WITH ES DATA: ');
    //console.log(this.es_data);
    this.table_content = this.build_table(Object.values(this.table.columns), this.es_data)
    this.table_header = this.table_content[0];
    this.table_content.splice(0, 1);
    this.tableName = this.table.title;
    this.rendering = false;
  }

  private build_table(columns: Array<ColumnDefinition>, data: Array<ESBoolQueryResponse>) {
    var tab = Array<Array<String>>();
    for (var i in columns) {
      var col = Array<String>();
      var col_def = columns[i];
      col[0] = col_def.name;
      console.log(col_def);
      for (var j = 0; j < data.length; j++) {
        var record = data[j]['_source'];
        col[j + 1] = this.get_val(record, col_def.path)
      }
      tab.push(col);
    }
    return this.transpose(tab);
  }


  private get_val(datum: ESBoolQueryResponse, path: any[]) {
    var value = datum;
    for (var i in path) {
      if (value && value[path[i]]) {
        value = value[path[i]];
      }
    }
    return value.toString();
  }

  private transpose(matrix) {
    return matrix[0].map((col, i) => matrix.map(row => row[i]));
  }

  public delete_column(colname: string) {
    this.drop_col.next(colname);
  }

  public shift_column(column_index: number, delta: number) {
    this.shift_col.next([column_index, delta]);
  }


  saveColumnWidth(size: number, column: number) {
    console.log('SAVING COLUMN WIDTH HERE');
  }






}
