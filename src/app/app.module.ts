import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ShoppingListListComponent } from './shopping-list-list/shopping-list-list.component';
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SortByFieldPipe } from './sort-by-field.pipe';
import { LoggerInterceptorService } from './logger-interceptor-service';
import { LoginComponent } from './login/login.component';
import { ErrorMessagesComponent } from './error-messages/error-messages.component';
import { AuthInterceptorService } from './auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    ShoppingListListComponent,
    ShoppingListComponent,
    SortByFieldPipe,
    LoginComponent,
    ErrorMessagesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoggerInterceptorService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    }
  ]
    ,
  bootstrap: [AppComponent]
})
export class AppModule { }
