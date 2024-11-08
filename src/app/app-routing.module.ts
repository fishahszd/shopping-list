import { inject, NgModule } from '@angular/core';
import { mapToCanActivate, Router, RouterModule, Routes } from '@angular/router';
import { ShoppingListListComponent } from './shopping-list-list/shopping-list-list.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { LoginComponent } from './login/login.component';
import { AuthService } from './auth.service';
import { authGuard } from './auth.guard';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {
    path: 'lists/:id', 
    component: ShoppingListComponent,
    canActivate: [authGuard]
  },
  {
    path: 'lists', 
    component: ShoppingListListComponent,
    canActivate: [authGuard]
  },
  {path: '', redirectTo: '/lists', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
