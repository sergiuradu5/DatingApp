import { Injectable } from '@angular/core';
import { User } from '../_models/user';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserSearchFilter } from '../_models/user-search-filter';
import { UserSearchParams } from '../_models/user-search-params';
import { GeolocationService } from '../_services/geolocation.service';
import { AuthService } from '../_services/auth.service';

@Injectable()
export class MemberListResolver implements Resolve<User[]> {

  pageNumber = 1;
  pageSize = 4;
  userSearchFilter: UserSearchFilter;
  actionOnUserFromRoute : string;
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private alertify: AlertifyService,
  ) {
    this.userService.currentUserSearchFilter.subscribe(data => {
      this.userSearchFilter = data;
      
    });
  }

    resolve(route: ActivatedRouteSnapshot) : Observable<User[]> {
          let userParams : UserSearchParams;
        
        

          userParams  = {
            pageNumber: this.pageNumber,
            pageSize: this.pageSize,
            likers: false,
            likees: false,
            showNonVisitedMembers: true,
            withDetails: true, //We want the users with details
            showDistance: true,
            distanceLimit: true,
            userId: this.authService.decodedToken.nameid
          }

          return this.userService.getUsers(userParams, this.userSearchFilter).pipe(
            catchError(error => {
              this.alertify.error('Problem retreiving data');
              this.router.navigate(['/home']);
              return of(null);
          })
      );
        
    }

}
