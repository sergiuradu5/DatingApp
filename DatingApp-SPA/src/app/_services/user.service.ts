import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../_models/user';
import {environment} from '../../environments/environment';
import { PaginatedResult } from '../_models/pagination';
import { map } from 'rxjs/operators';
import { Message } from '../_models/message';
import { UserSearchFilter } from '../_models/user-search-filter';
import { UserSearchParams } from '../_models/user-search-params';

const httpOptions = {
  headers: new HttpHeaders({
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  })
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl= environment.baseUrl;
  user: User = JSON.parse(localStorage.getItem('user'));
  //Storing user parameters for searching for other users
  // defaultUserSearchFilter = {
  //   ...(this.user.gender === 'female' && {gender: 'male'}),
  //   ...(this.user.gender === 'male' && {gender: 'female'}),
  //   ...(this.user.gender === 'other' && {gender: 'other'}),
  //   minAge: 18,
  //   maxAge : 99,
  //   orderBy : 'lastActive'
    
  // };
  localStorageUserSearchFilter : UserSearchFilter = JSON.parse(localStorage.getItem('searchFilter'));
  private userSearchFilter = new BehaviorSubject<UserSearchFilter>(this.localStorageUserSearchFilter);
  
  currentUserSearchFilter = this.userSearchFilter.asObservable();

constructor(private http: HttpClient) {
 }

getUsers(userParams?: UserSearchParams, userSearchFilter? : UserSearchFilter): Observable<PaginatedResult<User[]>> {
  const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<User[]>();

  let params = new HttpParams();

  if(userParams.pageNumber != null && userParams.pageSize != null) {
    params = params.append('pageNumber', userParams.pageNumber.toString());
    params = params.append('pageSize', userParams.pageSize.toString());
  }
  // let userSearchFilterForBody: any = {};

  if(userParams.likers === true)
  {
    params = params.append('likers', 'true');
  }

  if(userParams.likees === true)
  {
    params = params.append('likees', 'true');
  }
  
  console.log(`showNonVisitedMembers: ${userParams.showNonVisitedMembers}`);
  if(userParams.showNonVisitedMembers) {
    params = params.append('showNonVisitedMembers', 'true');
  }

  if(userSearchFilter != null)
  { 
    // userSearchFilterForBody.minAge = userSearchFilter.minAge;
    // userSearchFilterForBody.maxAge = userSearchFilter.maxAge;
    // userSearchFilterForBody.gender = userSearchFilter.gender;
    // userSearchFilterForBody.orderBy = userSearchFilter.orderBy;
    params = params.append('minAge', userSearchFilter.minAge.toString());
    params = params.append('maxAge', userSearchFilter.maxAge.toString());
    params = params.append('gender', userSearchFilter.gender);
    params = params.append('orderBy', userSearchFilter.orderBy);
  }

  return this.http.get<User[]>(this.baseUrl + 'users', {observe: 'response', params,})
  .pipe(
    map(response => {
      paginatedResult.result = response.body;
      if (response.headers.get('Pagination') != null ) {
        paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
      }
      return paginatedResult;
    })
  );
}

getUser(id): Observable<User> {
  return this.http.get<User>(this.baseUrl + 'users/' + id);
}

updateUser(id: number, user: User) {
 const headers = new HttpHeaders()
  .set('Content-Type', 'application/json')
  .set('Access-Control-Allow-Origin', '*');
 return this.http.put(this.baseUrl + 'users/' + id, user);
}

deleteUser(id) :Observable<User> {
  return this.http.delete<User>(this.baseUrl + 'users/' + id);
}

setMainPhoto(userId: number, id: number)
{
  return this.http.post(this.baseUrl + 'users/' + userId + '/photos/' + id + '/setMain', {});
}

deletePhoto(userId: number, id: number) {
  return this.http.delete(this.baseUrl + 'users/' + userId + '/photos/' + id);
}

sendLike(id: number, recipientId: number){
  return this.http.post(this.baseUrl + 'users/' + id + '/like/' + recipientId, {});
}
//Visiting a user, so that he won't appear twice to the same visitor
visitUser(id: number, visitedId: number){
  return this.http.post(this.baseUrl + 'users/' + id + '/visit/' + visitedId, {});
}

getMessages(id: number, page?, itemsPerPage?, messageContainer?)
{
  const paginatedResult: PaginatedResult<Message[]> = new PaginatedResult<Message[]>();
  let params = new HttpParams();

  params = params.append('MessageContainer', messageContainer);

  if(page != null && itemsPerPage != null) {
    params = params.append('pageNumber', page);
    params = params.append('pageSize', itemsPerPage);
  }

  return this.http.get<Message[]>(this.baseUrl + 'users/' + id + '/messages', {observe: 'response', params})
    .pipe(
      map(response => {
        paginatedResult.result = response.body;
        if(response.headers.get('Pagination') != null) {
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
        }
        return paginatedResult;
      })
    )
}

getMessageThread(id: number, recipientId: number)
{
  return this.http.get<Message[]>(this.baseUrl + 'users/' + id + '/messages/thread/' + recipientId);
}

sendMessage(id: number, message: Message) {
  return this.http.post(this.baseUrl + 'users/' + id + '/messages', message);
}

deleteMessage(id: number, userId: number) {
  return this.http.post(this.baseUrl + 'users/' + userId + '/messages/' + id, {});
}

markAsRead(userId: number, messageId: number) {
  this.http.post(this.baseUrl + 'users/' + userId + '/messages/' + messageId + '/read', {})
  .subscribe();
}

initiateUserSearchFilter(userSearchFilter: any) {
  
  this.userSearchFilter.next(userSearchFilter);
  console.log(`>>>>Initiating user search filter with localStorage.get('searchFilter'): `, this.currentUserSearchFilter)
}

updateUserSearchFilter(userId: number, userSearchFilter: UserSearchFilter) {
  const headers = new HttpHeaders()
  .set('Content-Type', 'application/json')
  .set('Access-Control-Allow-Origin', '*');
  this.userSearchFilter.next(userSearchFilter);
  this.http.put(this.baseUrl + 'users/' + userId + '/searchFilter', userSearchFilter)
    .subscribe(data => {
      localStorage.removeItem('searchFilter');
      localStorage.setItem('searchFilter', JSON.stringify(userSearchFilter));
    })
  
}

resetUserSearchFilter(id: number) {
    let defaultUserSearchFilter:any = {};
    defaultUserSearchFilter.userid = this.user.id;
    if (this.user.gender === 'female')
    {
      defaultUserSearchFilter.gender = 'male';
    }
    if(this.user.gender === 'male')
    {
      defaultUserSearchFilter.gender = 'female';
    }
    if(this.user.gender === 'other')
    {
      defaultUserSearchFilter.gender = 'other';
    }
    defaultUserSearchFilter.minAge = 18;
    defaultUserSearchFilter.maxAge = 99;
    defaultUserSearchFilter.orderBy = 'lastActive';

    this.userSearchFilter.next(defaultUserSearchFilter);
    this.http.put(this.baseUrl + 'users/' + id + '/searchFilter', defaultUserSearchFilter)
    .subscribe(data => {
      localStorage.removeItem('searchFilter');
      localStorage.setItem('searchFilter', JSON.stringify(defaultUserSearchFilter));
    })

  }

getUserSearchFilter(id: number): Observable<UserSearchFilter> {
  return this.http.get<UserSearchFilter>(this.baseUrl + 'users/' + id + '/searchFilter');
  }
resetUserAfterLogout() {
  this.user = null;
}

resetUserAfterLogin(user: User) {
  this.user = user;
}
}
