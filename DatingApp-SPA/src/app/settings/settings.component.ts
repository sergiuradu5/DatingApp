import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/_models/user';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from 'src/app/_services/auth.service';
import { PaginatedResult, Pagination } from '../_models/pagination';

import  { Options } from '@angular-slider/ngx-slider';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  // Values for the ngx-slider
  sliderMinValue: number = 18;
  sliderMaxValue: number = 99;
  sliderOptions: Options = {
    floor: 18,
    ceil: 99
  };

  users: User[];
  currentUser: User;
  user: User = JSON.parse(localStorage.getItem('user'));
  genderList = [{value: 'male', display: 'Males'}, {value: 'female', display: 'Females'}, {value: 'other', display: 'Other' }];
  userParams: any = {};
  pagination: Pagination;
  showNonVisitedMembers: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private alertify: AlertifyService,
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.users = data['users'].result;
      this.currentUser = this.users[0];
      this.pagination = data['users'].pagination;
      this.showNonVisitedMembers = true;
    });

    this.userService.currentUserParams.subscribe(
      data => {
        this.userParams = data;
        console.log('userParams: ', this.userParams);
    });

    //Old data for resetting the user params everytime the user reloads member-list page
    // if (this.user.gender === 'female')
    // {
    //   this.userParams.gender = 'male';
    // }
    // if(this.user.gender === 'male')
    // {
    //   this.userParams.gender = 'female';
    // }
    // if(this.user.gender === 'other')
    // {
    //   this.userParams.gender = 'other';
    // }

    // this.userParams.minAge = 18;
    // this.userParams.maxAge = 99;
    // this.userParams.orderBy = 'lastActive';
  }

  updateUserParams() {
    this.userService.updateUserParams(this.userParams);
  }

  resetUserParams() {
    this.userService.resetUserParams();
  }

}
