import { Component, OnInit } from '@angular/core';
import { UserService } from '../../_services/user.service';
import { AlertifyService } from '../../_services/alertify.service';
import { User } from '../../_models/user';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
import { Pagination, PaginatedResult } from 'src/app/_models/pagination';
import { UserSearchFilter } from 'src/app/_models/user-search-filter';
import { UserSearchParams } from 'src/app/_models/user-search-params';
import { Subject } from 'rxjs/internal/Subject';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
 
  users: User[];
  currentUser: User;
  user: User = JSON.parse(localStorage.getItem('user'));
  genderList = [{value: 'male', display: 'Males'}, {value: 'female', display: 'Females'}, {value: 'other', display: 'Other' }];
  userSearchFilter: UserSearchFilter;
  pagination: Pagination;
  showNonVisitedMembers: boolean = true;
  actionOnUserFromRoute : any; //It is an object that contains the "action" property, which is either skip or like
  actionEventToMemberCard: Subject<string> = new Subject<string>();

 
  constructor(private userService: UserService,
          private alertify: AlertifyService,
          private route: ActivatedRoute,
          private router: Router
          )
          {            
           }

  ngOnInit() {

    this.userService.currentUserSearchFilter.subscribe(data => {
      this.userSearchFilter = data;
     })
     
    this.route.data.subscribe(data => {
      this.users = data['users'].result;
      this.currentUser = this.users[0];
      this.pagination = data['users'].pagination;
      this.showNonVisitedMembers = true;
    });
    this.route.params.subscribe(params => {
      this.actionOnUserFromRoute = params['action'];
    });
    
    
  }
  
  

  skipCurrentUser(userId: number) {
    console.log(`skipCurrentUser(${userId}) -> enabled`);
    this.users.forEach((user,index)=>{
      if(user.id==userId)  {
        this.users.splice(index, 1);
        this.pagination.totalItems -= 1;
      }
    })
    console.log("Users: ", this.users);
    if (this.users.length <= 1) {
      this.loadNextUsersAndConcatenate();
      
    }
  }

  loadNextUsersAndConcatenate() {
    let userParams : UserSearchParams = {
      pageNumber: this.pagination.currentPage+1,
      pageSize: this.pagination.itemsPerPage,
      likers: false,
      likees: false,
      showNonVisitedMembers: true, 
      withDetails: true
    };
    this.userService.getUsers(userParams, this.userSearchFilter)
    .subscribe((res: PaginatedResult<User[]>) => {
      this.users = [...this.users, ...res.result];
      this.pagination = res.pagination;
      console.log("Users after concat: ", this.users);
    }, error => {
      this.alertify.error(error);
    })
  }

  loadUsers() {
    let userParams : UserSearchParams = {
      pageNumber: this.pagination.currentPage,
      pageSize: this.pagination.itemsPerPage,
      likers: false,
      likees: false,
      showNonVisitedMembers: true,
      withDetails: true
    };
    this.userService.getUsers(userParams, this.userSearchFilter)
    .subscribe((res: PaginatedResult<User[]>) => {
      this.users = res.result;
      this.currentUser = this.users[0];
      this.pagination = res.pagination;
    }, error => {
      this.alertify.error(error);
    });
  }

}
