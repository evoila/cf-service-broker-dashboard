import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


import { CoreHttpService, EntityService } from 'app/core';

import { environment } from 'environments/runtime-environment';

const serviceInstanceId = environment.serviceInstanceId;
const endpoint = environment.baseUrls.serviceBrokerUrl;
@Injectable()
export class ServiceKeysService extends EntityService {
  SORT_CONFIG = 'sort=startDate,desc';
  BACKUP_BASEURL = endpoint + '/custom/v2/manage';

  constructor(protected readonly httpService: CoreHttpService) {
    super(httpService);
  }

  public loadAll(entityRel: string): Observable<{} | any> {
    return this.all(this.BACKUP_BASEURL + '/' + entityRel + '/' + serviceInstanceId + '/');
  }

  public deleteOne(entityRel: string, entity: any): Observable<{} | any> {
    return this.delete(this.BACKUP_BASEURL + '/' + entityRel  + '/' + serviceInstanceId + '/' + entity.id);
  }

  public loadOne(entityRel: string, id: string): Observable<{} | any> {
    return this.get(this.BACKUP_BASEURL + '/' + entityRel  + '/' + serviceInstanceId + '/' + id);
  }

  public saveOne(entity: any, entityRel: string, id?: string): Observable<{} | any> {
    return this.post(this.BACKUP_BASEURL + '/' + entityRel  + '/' + serviceInstanceId, {});
  }

}
