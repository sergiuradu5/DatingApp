import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/_models/user';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from 'src/app/_services/auth.service';

import  { Options } from '@angular-slider/ngx-slider';
import { UserSearchFilter } from '../_models/user-search-filter';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  // Values for the ngx-slider
  ageSliderOptions: Options = {
    floor: 18,
    ceil: 99
  };

  distanceSliderOptions: Options = {
    floor: 1,
    ceil: 300
  }

  user: User = JSON.parse(localStorage.getItem('user'));
  genderList = [{value: 'male', display: 'Males'}, {value: 'female', display: 'Females'}, {value: 'other', display: 'Other' }];
  userSearchFilter: UserSearchFilter;
  showNonVisitedMembers: boolean = true;

  constructor(
    private alertify: AlertifyService,
    private userService: UserService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // this.route.data.subscribe(data => {
    //   this.userSearchFilter = data['searchFilter'].result;
    // });
    this.userService.currentUserSearchFilter.subscribe(userSearchFilter => {
      this.userSearchFilter = userSearchFilter;
      
    })
  }

  updateUserSearchFilter() {
    
    this.userService.updateUserSearchFilter(this.authService.decodedToken.nameid, this.userSearchFilter);
  }

  resetUserSearchFilter() {
    this.userService.resetUserSearchFilter(this.authService.decodedToken.nameid);

  }

}
