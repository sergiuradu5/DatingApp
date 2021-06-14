import { Injectable } from '@angular/core';
import { User } from '../_models/user';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserSearchParams } from '../_models/user-search-params';
import { UserSearchFilter } from '../_models/user-search-filter';
import { AuthService } from '../_services/auth.service';

@Injectable()
export class MatchesResolver implements Resolve<User[]> {

  pageNumber =1;
  pageSize = 6;
  likesParam = 'Matches';
  constructor(
    private userService: UserService,
    private router: Router,
    private authService: AuthService,
    private alertify: AlertifyService
  ) {}

    resolve(route: ActivatedRouteSnapshot) : Observable<User[]> {
      let userParams : UserSearchParams = {
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        likers: this.likesParam === 'Likers' ? true : false,
        showMatches: this.likesParam === 'Matches' ? true : false,
        showNonVisitedMembers: false,
        userId: this.authService.decodedToken.nameid
      }
        return this.userService.getUsers(userParams, null).pipe(
            catchError(error => {
                this.alertify.error('Problem retreiving data');
                this.router.navigate(['/home']);
                return of(null);
            })
        );
    }

}
