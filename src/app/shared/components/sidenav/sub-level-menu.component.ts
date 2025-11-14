import { Component, Input, OnInit } from '@angular/core';
import {fadeInOut, INavBarData} from './Helper'
import { CommonModule } from "@angular/common";
import { RouterLink, RouterLinkActive, Router, RouterModule, ActivatedRoute} from "@angular/router";
import { animate, style, transition, trigger, state } from '@angular/animations';

@Component({
  selector: 'app-sub-level-menu',
  standalone: true,
  imports: [ CommonModule, RouterLink, RouterLinkActive, RouterModule],
  template: `
 <ul *ngIf="collapsed && data.items && data.items.length > 0" 
 [@submenu]="expanded ? {value: 'visible', 
 params: {transitionParams: '400ms cubic-bezier(0.86, 0, 0.07, 1)', height: '*'}} 
 : {value : 'hidden',
  params : {transitionParams: '400ms cubic-bezier(0.86, 0, 0.07, 1)', height: '0'}}"
    class = "sublevel-nav"
 >
    <li class = "sublevel-nav-item" *ngFor="let item of data.items" 
    >
      <a class = "sublevel-nav-link"
      (click)="handleClick(item)"
      *ngIf="item.items && item.items.length > 0"
      
      >
        <i class="sublevel-link-icon fa fa-circle"></i>
        <span class= "sublevel-linktext" @fadeInOut 
        *ngIf="collapsed">{{item.label}}</span>
        <i *ngIf="item.items && collapsed" class="menu-collapse-icon"
        [ngClass]="!item.expanded ? 'fal fa-angle-right' : 'fal fa-angle-down'"></i>
      </a>
      <a class = "sublevel-nav-link"
        *ngIf="!item.items || (item.items && item.items.length === 0)"
        [routerLink]="[item.routerLink]"
        routerLinkActive="active-sublevel"
        [routerLinkActiveOptions]="{exact: true}"
      >
      <i class="sublevel-link-icon fa fa-circle"></i>  
      <span class= "sublevel-linktext" @fadeInOut *ngIf="collapsed">{{item.label}}</span>
      </a>
<div *ngIf="item.items && item.items.length > 0">
  <app-sub-level-menu
    [data]="item"
    [collapsed]="collapsed"
    [multiple]="multiple"
    [expanded]="item.expanded">
  </app-sub-level-menu>
</div>
    </li>
 </ul>
  `,
  styleUrls: ['./sidenav.scss'],
  animations : [
    fadeInOut,
    trigger ('submenu', [
      state('hidden' ,style ({
        height :'0',
        overflow: 'hidden'
      })),
      state ('visible', style ({
        height: '*',
        overflow: 'hidden'
      })),
      transition ('visible <=> hidden', [style({overflow: 'hidden'}), 
        animate('{{transitionParams}}')]
    ),
    transition ('void => *', animate(0))
    ])
  ]
})
export class SubLevelMenuComponent implements OnInit{
  constructor(private router: Router) {}
  @Input () data : INavBarData = {
    routerLink : '',
    icon: '',
    label : '',
    items : []
  }
  @Input () collapsed = false;
  @Input () animating: boolean | undefined;
  @Input () expanded: boolean | undefined
  @Input () multiple : boolean = false;

  ngOnInit(): void {
    
  }

  handleClick(item : any) : void{    
    if (!this.multiple){
      if (this.data.items && this.data.items.length > 0){
        for (let modelItem of this.data.items){
          if (item !==modelItem && modelItem.expanded){
            modelItem.expanded = false;

          }
        }
      }
    }
    item.expanded = !item.expanded;
    // if (item.routerLink) {
    //   this.router.navigate([item.routerLink])
    // }
  }
}
