import { Injectable } from '@angular/core';
import { User } from '../_models/user';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserParams } from '../_models/user-params';

@Injectable()
export class MemberListResolver implements Resolve<User[]> {

  pageNumber = 1;
  pageSize = 4;
  userParams: UserParams;
  constructor(
    private userService: UserService,
    private router: Router,
    private alertify: AlertifyService
  ) {
    this.userService.currentUserParams.subscribe(data => {
      this.userParams = data;
    })
  }

    resolve(route: ActivatedRouteSnapshot) : Observable<User[]> {
        if (this.userParams !== null) {
          console.log('member-list.resolver with userParams: ', this.userParams);
          return this.userService.getUsers(this.pageNumber, this.pageSize, this.userParams, null, true).pipe(
            catchError(error => {
                this.alertify.error('Problem retreiving data');
                this.router.navigate(['/home']);
                return of(null);
            })
        );
        } else {
          return this.userService.getUsers(this.pageNumber, this.pageSize, null, null, true).pipe(
            catchError(error => {
                this.alertify.error('Problem retreiving data');
                this.router.navigate(['/home']);
                return of(null);
            })
        );
        }
        
    }

}
