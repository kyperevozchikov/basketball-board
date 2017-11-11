import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {DashboardComponent} from "../pages/dashboard/dashboard.component";
import {AdminComponent} from "../pages/admin/admin.component";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {RouterModule} from "@angular/router";
import {DashboardService} from "../classes/services/dashboard.service";

// Define the routes
const ROUTES = [
  {
    path: '',
    redirectTo: 'board',
    pathMatch: 'full'
  },
  {
    path: 'board',
    component: DashboardComponent
  },
  {
    path: 'control',
    component: AdminComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    AdminComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(ROUTES)
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [DashboardComponent, AdminComponent]
})
export class AppModule { }
