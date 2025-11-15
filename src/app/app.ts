import { Component, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { Sidenav } from "./shared/components/sidenav/sidenav";
import { CommonModule } from '@angular/common';
import { Body } from "./shared/components/body/body";
import { Header } from './shared/components/header/header';
import { FormsModule } from '@angular/forms';
interface SideNavToggle{
  screenWidth: number;
  collapsed: boolean;
}
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Sidenav, CommonModule, Body, Header, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  standalone: true,
})
export class App {
  message: string = '';
  title  = 'sidenav';
  showLayout = false;
  islogin = false;

  constructor(private router: Router) { }
  private routerSub!: Subscription;
  ngOnInit(): void {
  this.routerSub = this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe((event: any) => {
      this.updateLayout(event.urlAfterRedirects || event.url);
    });

  this.updateLayout(this.router.url);
}

ngOnDestroy(): void {
  if (this.routerSub) {
    this.routerSub.unsubscribe();
  }
  }

  updateLayout(currentUrl: string) {
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('access_token');
    this.islogin = !!token;
    console.log('updateLayout', currentUrl, 'token?', !!localStorage.getItem('access_token'));

    // Solo decide si muestra layout o no
    this.showLayout = this.islogin && currentUrl !== '/login';
  }

  isSideNavCollapsed = false;
  screenWidth = 0;

  onToggleSideNav(data : SideNavToggle) : void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }
}
