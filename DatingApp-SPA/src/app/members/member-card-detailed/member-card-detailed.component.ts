import { Component, OnInit, Input, EventEmitter, Output, ViewChild, ElementRef, HostListener } from '@angular/core';
import { User } from 'src/app/_models/user';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { trigger, keyframes, animate, transition } from '@angular/animations';
import * as kf from '../keyframes';
import { NgxGalleryImage, NgxGalleryOptions, NgxGalleryAnimation, NgxGalleryImageSize, NgxGalleryComponent } from 'ngx-gallery';

import { ActionService } from 'src/app/_services/action.service';
import { Router } from '@angular/router';
import * as helpers from 'src/app/_helpers/isEmpty';

@Component({
  selector: 'app-member-card-detailed',
  templateUrl: './member-card-detailed.component.html',
  styleUrls: ['./member-card-detailed.component.css'],
  animations: [ 
    trigger('cardAnimator', [      
      transition('* => slideOutLeft', animate(350, keyframes(kf.slideOutLeft))),
      transition('* => slideOutRight', animate(350, keyframes(kf.slideOutRight))),
      
    ])
  ]
})
export class MemberCardDetailedComponent implements OnInit {
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  showGalleryArrows: boolean;
  animationState: string;
  cardImageWidth: string;
  actionToPerform: string;
  startIndexOfPhoto: number;
  isGalleryIntoView: boolean;
  screenHeight: number;
  screenWidth: number;

  
  @ViewChild('gallery') gallery: NgxGalleryComponent;
  @ViewChild('scrollToTop')  myScrollContainerToTop: ElementRef;
  @ViewChild('scrollToBottom')  myScrollContainerToBottom: ElementRef;
  @ViewChild('memberCardDetailed') memberCardDetailedContainer: ElementRef;
  @Input() user: User;
  @Output() skipCurrentUser = new EventEmitter();
  @Output() userLikedForItIsAMatch = new EventEmitter<any>();
  @HostListener('window:resize', ['$event'])
onResize(event?) {
   this.screenHeight = window.innerHeight;
   this.screenWidth = window.innerWidth;
}
  

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private alertify: AlertifyService,
    private actionService: ActionService,
    private router: Router
  ) { 
    this.onResize();
  }

  ngOnInit() {

    this.showGalleryArrows = this.user.photos.length > 1;
    var heightToSet = this.screenHeight - 259;
    
    this.galleryOptions = [
      {
        startIndex: 0,
        width: '550px',
        height: heightToSet.toString() + 'px',
        imageSize: NgxGalleryImageSize.Cover,
        imagePercent: 100,
        imageAnimation: NgxGalleryAnimation.Slide,
        imageArrows: this.showGalleryArrows,
        imageArrowsAutoHide : false,
        thumbnails: false,
        preview: false,
        arrowNextIcon: 'fa fa-angle-right fa-2x',
        arrowPrevIcon: 'fa fa-angle-left fa-2x'
      },
      {
        breakpoint: 605,
        width: '400px',
        height: '500px',
        imagePercent: 80,
        imageArrowsAutoHide : false,
        imageArrows: this.showGalleryArrows,
        arrowNextIcon: 'fa fa-angle-right fa-2x',
        arrowPrevIcon: 'fa fa-angle-left fa-2x'
      },
      {
        breakpoint: 410,
        width: '310px',
        height: '410px',
        imagePercent: 80,
        imageArrowsAutoHide : false,
        imageArrows: this.showGalleryArrows,
        arrowNextIcon: 'fa fa-angle-right fa-2x',
        arrowPrevIcon: 'fa fa-angle-left fa-2x'
      }

    ];
    this.galleryImages =this.getImages();

  }


  getImages() {
    const imageUrls = [];
    imageUrls.push({
      small: this.user.photoUrl,
      medium: this.user.photoUrl,
      big: this.user.photoUrl
    });
    for (const photo  of this.user.photos) {
      if (this.user.photoUrl !== photo.url) {
        imageUrls.push({
        small: photo.url,
        medium: photo.url,
        big: photo.url
        });
      }
    }
    return imageUrls;
  }

  scrollToTheTop() {
      this.myScrollContainerToTop.nativeElement.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
  }

  scrollToTheBottom() {
    console.log("scrollToBottom");
        this.myScrollContainerToBottom.nativeElement.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
                   
  }

  isStringEmpty(str) {
    return helpers.isEmpty(str);
  }

  startAnimation(state) {
    console.log(state)
    if(!this.animationState) {
      this.animationState = state
    }
  }

  resetAnimationState() {
    this.animationState = '';
  }

  

  skipUser() {
    this.actionService.resetStartIndexOfMainCard();
    this.startAnimation('slideOutLeft');
    setTimeout( () => {
      this.proceedToNextUser();
    }, 350);
    
  }

  proceedToNextUser() {
    this.skipCurrentUser.emit(this.user.id);
    this.actionService.resetStartIndexOfMainCard;
    this.visitUser(this.user.id);
  }

  visitUser(visitedId: number) {
    this.userService.visitUser(this.authService.decodedToken.nameid, visitedId).subscribe( data=> {
      this.alertify.success('You have visited ' + this.user.knownAs);
    }, error => {
      this.alertify.error(error);
    })

  }

  sendLike(recipientId: number)
  {
    this.actionService.resetStartIndexOfMainCard;
    this.userService.sendLike(this.authService.decodedToken.nameid, recipientId).subscribe( data=> {
      this.alertify.success('You have liked ' + this.user.knownAs);
    }, error => {
      this.alertify.error(error);
    }); 
    
    this.startAnimation('slideOutRight');
    
    setTimeout(() => {
      if (this.user.hasLikedCurrentUser) {
        const userLiked = {
          knownAs: this.user.knownAs,
          photoUrl: this.user.photoUrl
        }
        console.log('[member-card-detailed] userLikedForItIsAMatch: ', userLiked);
        this.userLikedForItIsAMatch.emit(userLiked); //Sending the relevant matched user data to the parent component
      } else {
        console.log('[member-card-detailed] userLikedForItIsAMatch: ', null);
        this.userLikedForItIsAMatch.emit(null);
      }
      this.proceedToNextUser();
      
    }, 350);
    
  }

  

}
