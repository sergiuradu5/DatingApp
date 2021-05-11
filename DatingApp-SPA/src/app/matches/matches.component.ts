import { Component, OnInit } from '@angular/core';
import { AlertifyService } from '../_services/alertify.service';
import { AuthService } from '../_services/auth.service';
import { UserService } from '../_services/user.service';
import { ActivatedRoute } from '@angular/router';
import { Pagination, PaginatedResult } from '../_models/pagination';
import { User } from '../_models/user';
import { UserSearchParams } from '../_models/user-search-params';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.css']
})
export class MatchesComponent implements OnInit {
  users: User[];
  pagination: Pagination;
  likesParam: string;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private route: ActivatedRoute,
    private alertify: AlertifyService


  ) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.users = data['users'].result;
      this.pagination = data['users'].pagination;
    });
    this.likesParam = 'Likers';
  }

  pageChanged(event: any) : void {
    this.pagination.currentPage = event.page;

    this.loadUsers();
  }

  loadUsers() {
    let userParams : UserSearchParams = {
      pageNumber: this.pagination.currentPage,
      pageSize: this.pagination.itemsPerPage,
      likers: this.likesParam === 'Likers' ? true : false,
      likees: this.likesParam === 'Likees' ? true : false,
      showNonVisitedMembers: false
    }
    this.userService.getUsers(userParams)
    .subscribe((res: PaginatedResult<User[]>) => {
      
      this.users = res.result;
      this.pagination = res.pagination;
    }, error => {
      this.alertify.error(error);
    });
  }

}
