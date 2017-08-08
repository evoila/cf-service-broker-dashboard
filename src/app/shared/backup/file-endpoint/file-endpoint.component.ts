import { Component, OnInit } from '@angular/core';
import { BackupService } from '../backup.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'sb-file-endpoint',
  templateUrl: './file-endpoint.component.html',
  styleUrls: ['./file-endpoint.component.scss']
})
export class FileEndpointComponent implements OnInit {
  readonly ENTITY: string = 'destinations';
  destination: any = {};
  update = false;

  constructor(protected readonly backupService: BackupService,
              protected readonly route: ActivatedRoute,
              protected readonly router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      console.log(params['fileEndpointId']);
       if (params['fileEndpointId']) {
         this.update = true;
          this.backupService.loadEntity(this.ENTITY, params['fileEndpointId'])
            .subscribe(
              (destination: any) => { this.destination = destination},
            );
       }
    });

  }

  delete(): void {
    this.backupService.delete(this.ENTITY, this.destination)
      .subscribe((destination: any) => {
        this.redirect();
      });
  }

  onSubmit(): void {
    if (this.update) {
      this.backupService.update(this.ENTITY, this.destination)
        .subscribe((destination: any) => {
          this.redirect();
      });
    } else {
      this.backupService.save(this.ENTITY, this.destination)
        .subscribe((destination: any) => {
          this.redirect();
      });
    }
  }

  private redirect(): void {
    this.router.navigate(['/backup']);
  }

}