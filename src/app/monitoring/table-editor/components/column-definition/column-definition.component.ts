import { Component, OnInit, Optional, Output, EventEmitter, Input } from '@angular/core';
import { ColumnDefinition } from '../../model/column-definition';
import { MatTreeFlattener, MatTreeFlatDataSource} from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Observable, of as observableOf } from 'rxjs';
import { TableEditorComponent } from '../../containers/table-editor/table-editor.component';

export class FileNode {
  children: FileNode[];
  filename: string;
  type: any;
  path: any[]; // nodes carry their complete path from object root 
  selected: boolean;
}
export class FileFlatNode {
  constructor(
     public expandable: boolean, public filename: string, public level: number, public type: any, public path: any[], public selected: boolean) {}
}

@Component({
  selector: 'sb-column-definition',
  templateUrl: './column-definition.component.html',
  styleUrls: ['./column-definition.component.scss']
})

export class ColumnDefinitionComponent implements OnInit {

  @Output('column')
  update_column = new EventEmitter<ColumnDefinition>();

  @Input('data')
  data: Object;


  treeControl: FlatTreeControl<FileFlatNode>;
  treeFlattener: MatTreeFlattener<FileNode, FileFlatNode>;
  dataSource: MatTreeFlatDataSource<FileNode, FileFlatNode>;

  selected_data_key = "";
  show_column_preview = false;
  preview_column_data = Array<String>();
  cdef_name: string = "unnamed";
  cdef_path: any[];

  constructor(
    @Optional() public parent: TableEditorComponent
    ){

    this.treeFlattener = new MatTreeFlattener(this.transformer, this._getLevel,
    this._isExpandable, this._getChildren);
    this.treeControl = new FlatTreeControl<FileFlatNode>(this._getLevel, this._isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  }


 transformer = (node: FileNode, level: number) => {
    return new FileFlatNode(!!node.children, node.filename, level, node.type, node.path, node.selected);
 }
 private _getLevel = (node: FileFlatNode) => node.level;
 private _isExpandable = (node: FileFlatNode) => node.expandable;
 private _getChildren = (node: FileNode): Observable<FileNode[]> => observableOf(node.children);
 hasChild = (_: number, _nodeData: FileFlatNode) => _nodeData.expandable;



  ngOnInit() {
    
    this.dataSource.data = this.buildFileTree(this.data);
  
  }


  buildFileTree(obj: {[key: string]: any}, level: number=0, path: any[]=[]): FileNode[] {
    return Object.keys(obj).reduce<FileNode[]>((accumulator, key) => {
       const value = obj[key];
       const node = new FileNode();
       node.filename = key;
       node.path = path.concat(key);
       if (value != null) {
          if (typeof value === 'object') {
             node.children = this.buildFileTree(value, level + 1, path.concat(key));
          } else {
             node.type = value;
          }
       }
       
       return accumulator.concat(node);
    }, []);
  }

  /*
  public updatePreview(){
    this.show_column_preview = false;
    this.preview_column_data = [];
    for (var i=0; i<this.parent.raw_data.length; i++){
      const rec = this.parent.raw_data[i];
      var value = rec._source;
      for(var g in this.cdef_path){
        value = value[this.cdef_path[g]]
      }
      this.preview_column_data.push(value.toString()); 
    }
    setTimeout(() => {this.show_column_preview = true;})
  }
*/

  // TODO: DELETE COLUMNDEFINITION's QUERY_ID FIELD - it's not used and doesn't make sense 
  public saveColumn(){
    const col_def = new ColumnDefinition(this.parent.validated_scoped_selected_queries[0].query.id!, this.cdef_name, this.cdef_path)
    this.update_column.next(col_def);
    this.deselect_all();
    this.show_column_preview = false;
  }


  public onGotFocusNameInput(){  }

  public onLostFocusNameInput(){  }


  public select_leaf(node: FileNode){
    this.deselect_all();
    node.selected = true;
    this.cdef_path = node.path;
    this.selected_data_key = node.filename;
    this.cdef_name = this.selected_data_key;
    this.saveColumn();
  }

  public select_node(node: FileNode){
    console.log('selected: ' + node.filename);
  }


  private deselect_all(){
    for (let i = 0; i < this.treeControl.dataNodes.length; i++) {
      this.treeControl.dataNodes[i].selected = false;
    }
  }

}
