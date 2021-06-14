import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from 'src/app/_services/user.service';
import { User } from 'src/app/_models/user';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  @ViewChild('memberTabs', {static: true}) memberTabs: TabsetComponent;
  user: User;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  selectedTab: number;
  constructor(private userService: UserService, private alertify: AlertifyService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private location: Location) { }

  ngOnInit() {
    this.route.data.subscribe(data=> {
      this.user= data['user'];
    });

    /* Accessing the query params in the route */
    this.route.queryParams.subscribe(params => {
      this.selectedTab = params['tab'];
    })

    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false
    }
    ];
    this.galleryImages =this.getImages();
  }

  getImages() {
    const imageUrls = [];
    for (const photo  of this.user.photos) {
      imageUrls.push({
      small: photo.url,
      medium: photo.url,
      big: photo.url
    });
      
    }
    return imageUrls;
  }

  ngAfterViewInit() {
    this.memberTabs.tabs[this.selectedTab>0 ? this.selectedTab : 0].active = true;
  }

  selectTab(tabId: number) {
    this.memberTabs.tabs[tabId].active = true;
  }

  sendLike(recipientId: number)
  {
    this.userService.visitUser(this.authService.decodedToken.nameid, recipientId).subscribe (data => {
    })
    this.userService.sendLike(this.authService.decodedToken.nameid, recipientId).subscribe( data=> {
      this.user.hasMatchedCurrentUser = true;
      this.alertify.success('You can now write ' + this.user.knownAs + ' a message');
    }, error => {
      this.alertify.error(error);
    }); 
  }

  navigateBack() {
    this.location.back();
  }

 

}
