import { Component, OnInit, Input, EventEmitter, Output, ElementRef, ViewChild } from '@angular/core';
import { User } from 'src/app/_models/user';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { trigger, keyframes, animate, transition } from '@angular/animations';
import * as kf from '../keyframes';
import { NgxGalleryImage, NgxGalleryOptions, NgxGalleryAnimation, NgxGalleryImageSize } from 'ngx-gallery';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionService } from 'src/app/_services/action.service';
import {isEmpty} from 'src/app/_helpers/isEmpty';

@Component({
  selector: 'app-member-card-new-detailed',
  templateUrl: './member-new-detailed.component.html',
  styleUrls: ['./member-new-detailed.component.css'],
  animations: [ 
    trigger('cardAnimator', [
      transition('* => wobble', animate(350, keyframes(kf.wobble))),
      transition('* => flipOutY', animate(350, keyframes(kf.flipOutY))),
      transition('* => slideOutLeft', animate(350, keyframes(kf.slideOutLeft))),
      transition('* => slideOutRight', animate(350, keyframes(kf.slideOutRight))),
      transition('* => swing', animate(350, keyframes(kf.swing))),
    ])
  ]
})
export class MemberNewDetailedComponent implements OnInit {
  @ViewChild('scrollToTop') private myScrollContainerToTop: ElementRef;
  @ViewChild('scrollToBottom') private myScrollContainerToBottom: ElementRef;
  
  @Output() skipCurrentUser = new EventEmitter();
  user: User;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  showGalleryArrows: boolean;
  animationState: string;
  cardImageWidth: string;

  
  

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private alertify: AlertifyService,
    private route: ActivatedRoute,
    private router: Router,
    private actionService: ActionService
  ) { }

  ngOnInit() {
    this.route.data.subscribe(data=> {
      this.user= data['user'];
    });

    this.showGalleryArrows = this.user.photos.length > 1;
    
    this.galleryOptions = [
      {
        image: true,
        width: '550x',
        height: '700px',
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
        imagePercent: 100,
        imageArrowsAutoHide : false,
        imageArrows: this.showGalleryArrows,
        arrowNextIcon: 'fa fa-angle-right fa-2x',
        arrowPrevIcon: 'fa fa-angle-left fa-2x'
      },
      {
        breakpoint: 410,
        width: '310px',
        height: '410px',
        imagePercent: 100,
        imageArrowsAutoHide : false,
        imageArrows: this.showGalleryArrows,
        arrowNextIcon: 'fa fa-angle-right fa-2x',
        arrowPrevIcon: 'fa fa-angle-left fa-2x'
      }

    ];
    this.galleryImages =this.getImages();
    this.scrollToBottom();
  }

  ngAfterViewInit() {    
      this.scrollToBottom();
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

  scrollToTop() :void {
    try {
      this.myScrollContainerToTop.nativeElement.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
  } catch(err) { }
  }

  scrollToBottom(): void {
    try {
        this.myScrollContainerToBottom.nativeElement.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
    } catch(err) { }                 
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

  navigateBack() {
    this.scrollToTop();
    setTimeout(() => {
    this.router.navigate(['/members']);
    },350);
  }

  isStringEmpty(string) {
    return isEmpty(string);
  }

  skipUser() {
    let action = "skip";
    this.scrollToTop();
    setTimeout(() => {
      this.router.navigate(['/members']);
      this.actionService.emitActionToPerform(action);
    }, 300);
  }

  proceedToNextUser() {
    this.skipCurrentUser.emit(this.user.id);
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
    console.log('Scroll to top!');
    this.scrollToTop();
    
    
  }

}
