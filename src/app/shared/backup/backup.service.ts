import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EntityService, CoreHttpService } from 'app/core';
import { CustomEndpointService } from 'app/core/custom-endpoint.service';
import { environment } from 'environments/runtime-environment';

@Injectable()
export class BackupService extends EntityService {
  BACKUP_BASEURL: string;

  constructor(protected readonly httpService: CoreHttpService, 
    protected readonly customEndpointService: CustomEndpointService) {      
      super(httpService);
      this.BACKUP_BASEURL = customEndpointService.getUri('osb-backup-manager');
  }

  public getServiceInstance(): string {
    return environment.serviceInstance;
  }

  private pagingAndSortingHandler(pagingAndSorting: any): string {
    var resultString: string = "";

    if (pagingAndSorting == null || pagingAndSorting.length == 0)
      return resultString;

    resultString += "?size=" + pagingAndSorting.pageSize;
    resultString += "&page=" + (pagingAndSorting.page - 1);

    return resultString;
  }

  private filterHandler(filterQuery: any): string {
    var resultString: string = "";

    if (filterQuery == null)
      return resultString;

    Object.keys(filterQuery).forEach(key => {
      resultString += "&" + key + "=" + filterQuery[key];
    });

    return resultString;
  }

  public loadAll(entityRel: string, pagingAndSorting?: any): Observable<{} | any> {
    return this.all(this.BACKUP_BASEURL + '/' + entityRel + '/byInstance/' 
      + environment.serviceInstanceId + this.pagingAndSortingHandler(pagingAndSorting));
  }

  public loadAllFiltered(entityRel: string, filterQuery?: any, pagingAndSorting?: any): Observable<{} | any> {
    return this.all(this.BACKUP_BASEURL + '/' + entityRel + '/byInstance/' 
      + environment.serviceInstanceId + '/filtered' + this.pagingAndSortingHandler(pagingAndSorting) + this.filterHandler(filterQuery));
  }

  public deleteOne(entityRel: string, entity: any): Observable<{} | any> {
    return this.delete(this.BACKUP_BASEURL + '/' + entityRel + '/' + entity.id);
  }

  public loadOne(entityRel: string, id: string): Observable<{} | any> {
    return this.get(this.BACKUP_BASEURL + '/' + entityRel + '/' + id);
  }

  public saveOne(entity: any, entityRel: string, id?: string): Observable<{} | any> {
    if (id) {
      return this.patch(this.BACKUP_BASEURL + '/' + entityRel + '/' + id, entity);
    } else {
      return this.post(this.BACKUP_BASEURL + '/'  + entityRel, entity);
    }
  }

  public validate(rel: string, entity: any): Observable<{} | any> {
    return this.post(this.BACKUP_BASEURL + '/' + rel + '/validate' , entity);
  }

}
