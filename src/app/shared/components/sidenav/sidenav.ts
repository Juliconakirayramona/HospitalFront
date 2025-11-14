import { Component, HostListener, Output, EventEmitter } from '@angular/core';
import { animate, animation, keyframes, style, transition, trigger } from '@angular/animations';
import { fadeInOut, INavBarData } from './Helper';
import { navBarData } from './Navdata';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { SubLevelMenuComponent } from './sub-level-menu.component';


interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}
@Component({
  selector: 'app-sidenav',
  imports: [FormsModule, CommonModule, RouterLink, RouterLinkActive, SubLevelMenuComponent, RouterModule],
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.scss',
  animations: [    fadeInOut,
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('350ms', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('350ms', style({ opacity: 0 }))
      ])
    ]),

    trigger('rotate', [
      transition(':enter', [
        animate('1000ms', keyframes([
          style({ transform: 'rotate(0deg)', offset: 0 }),
          style({ transform: 'rotate(2turn)', offset: 1 })
        ]))
      ])
    ])],
})
export class Sidenav {

@Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
  collapsed = false;
  screenWidth = 0;
  navData = navBarData;
  multiple: boolean = false;

  @HostListener('window:resize', ['$event'])
  onRealize(event: any) {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 768) {
      this.collapsed = false;
      this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
    }
  }


    togleCollapse(): void {
    this.collapsed = !this.collapsed
    this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth })
  }
  closeSidenav(): void {
    this.collapsed = false;
    this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
  }
  handleClick (item: INavBarData) : void {
    // console.log('Clic:', item.label)
    if (!this.multiple) {
      for (let modelItem of this.navData){
        if (item !== modelItem && modelItem.expanded){
          modelItem.expanded = false
        }
      }
    }
    item.expanded = !item.expanded
  }
}
