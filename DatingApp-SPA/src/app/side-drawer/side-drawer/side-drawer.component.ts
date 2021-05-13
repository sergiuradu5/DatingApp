import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-side-drawer',
  templateUrl: './side-drawer.component.html',
  styleUrls: ['./side-drawer.component.css']
})
export class SideDrawerComponent implements OnInit {
  displayProperty: string;
  constructor() { }

  ngOnInit(): void {
    this.displayProperty = 'none';
  }

  
  toggleSideDrawer() {
    if (this.displayProperty === 'none') {
      this.displayProperty = 'block';
    }
    if (this.displayProperty === 'block') {
      this.displayProperty = 'none';
    }
  }


}