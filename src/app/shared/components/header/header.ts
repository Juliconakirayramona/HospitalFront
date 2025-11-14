import { Component, HostListener, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { languages, notifications, userItems } from './headerdummydata';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { CdkMenuModule } from '@angular/cdk/menu';
import { Auth } from '../../../features/auth/services/Auth.Services';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, OverlayModule, CdkMenuModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  @Input() collapsed = false;
  @Input() screenWidth = 0;

  canShowSearchAsOverlay = false;
  selectedLanguage: any;

  languages = languages;
  notifications = notifications;
  userItems = userItems


  constructor (private router : Router){

  }
    @HostListener('window:resize', ['$event'])
    onRealize(event: any) {
      this.checkCanShowSearchAsOverlay(window.innerWidth);
      
    }

  ngOnInit(): void{
    this.checkCanShowSearchAsOverlay(window.innerWidth);
    this.selectedLanguage = this.languages[0];
  }
  getHeadClass(): string{
    let styleClass = '';
    if(this.collapsed && this.screenWidth > 768){
      styleClass = 'head-trimmed';
    } else{
      styleClass = 'head-md-screen';
    }
    return styleClass;
  }

  checkCanShowSearchAsOverlay(innerWidth: number) : void {
    if(innerWidth < 845){
      this.canShowSearchAsOverlay = true;
    } else {
      this.canShowSearchAsOverlay = false;
    }
  }
  private authService = inject(Auth);

  onMenuclick (itemId: string){
    switch (itemId) {
      case 'logout':
        this.logout()
        break;
    }
  }
  logout() {
  this.authService.logout();
}
}
