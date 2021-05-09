import { Component, OnInit } from '@angular/core';
import { UserService } from '../../_services/user.service';
import { AlertifyService } from '../../_services/alertify.service';
import { User } from '../../_models/user';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
import { Pagination, PaginatedResult } from 'src/app/_models/pagination';
import { UserParams } from 'src/app/_models/user-params';

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
  userParams: UserParams;
  pagination: Pagination;
  showNonVisitedMembers: boolean = true;

 
  constructor(private userService: UserService,
          private alertify: AlertifyService,
          private route: ActivatedRoute)
          { }

  ngOnInit() {

    this.userService.currentUserParams.subscribe(data => {
      this.userParams = data;
     })
     
    this.route.data.subscribe(data => {
      this.users = data['users'].result;
      this.currentUser = this.users[0];
      this.pagination = data['users'].pagination;
      this.showNonVisitedMembers = true;
    });

   
  }

  resetFilters()
  {
    this.userService.resetUserParams();
    this.loadUsers();
  }

  // pageChanged(event: any) : void {
  //   this.pagination.currentPage = event.page;
  //   this.loadUsers();
  // }

  

  skipCurrentUser(userId: number) {
    console.log(`skipCurrentUser(${userId}) -> enabled`);
    this.users.forEach((user,index)=>{
      if(user.id==userId)  {
        this.users.splice(index, 1);
      }
    })
    console.log("Users: ", this.users);
    if (this.users.length <= 1) {
      this.loadNextUsersAndConcatenate();
      
    }
  }

  loadNextUsersAndConcatenate() {
    this.userService.getUsers(this.pagination.currentPage+1, this.pagination.itemsPerPage, this.userParams, "", true)
    .subscribe((res: PaginatedResult<User[]>) => {
      this.users = [...this.users, ...res.result];
      this.pagination = res.pagination;
      console.log("Users after concat: ", this.users);
    }, error => {
      this.alertify.error(error);
    })
  }

  loadUsers() {
    this.userService.getUsers(this.pagination.currentPage, this.pagination.itemsPerPage, this.userParams, "", true)
    .subscribe((res: PaginatedResult<User[]>) => {
      this.users = res.result;
      this.currentUser = this.users[0];
      this.pagination = res.pagination;
    }, error => {
      this.alertify.error(error);
    });
  }

}
