import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ShoppingListService } from '../shopping-list.service';
import { ShoppingList } from '../shopping-list.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ErrorMessagesComponent } from '../error-messages/error-messages.component';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-shopping-list-list',
  templateUrl: './shopping-list-list.component.html',
  styleUrl: './shopping-list-list.component.css'
})
export class ShoppingListListComponent implements OnInit, OnDestroy{
  shoppingLists: ShoppingList[] = [];
  subscriptions: Subscription[] = [];
  @ViewChild(ErrorMessagesComponent) messages!: ErrorMessagesComponent;

  addListForm: FormGroup = new FormGroup({
    listName: new FormControl(null, Validators.required),
  });

  constructor(private shoppingListService: ShoppingListService, private auth: AuthService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.loadShoppingLists(); //loading shopping lists at the start of the component
    
    //listening to the event about the list is changed
    this.subscriptions.push(this.shoppingListService.shoppingListListChanged.subscribe({
      next: () => {
        console.log("list is dirty");
        this.loadShoppingLists();    
      }
    }))
  }
  
  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
      console.log("unsubscribed");
    });
  }

  //calling the shopping list's own page
  onItemClicked(id: number) {
    this.router.navigate([id], {relativeTo: this.route});
  }

  onDelete(event: Event, shoppingListId: number) {
    if (confirm("Are you sure you want to delete this list?")) {
      this.shoppingListService.deleteList(shoppingListId);
    }
    event.stopPropagation();
  }

  //adding new list to the lists through the service
  addList() {
    this.shoppingListService.addList(new ShoppingList(0, this.auth.getUser()!.id!, this.addListForm.get("listName")?.value));
    this.addListForm.reset();
  }

  private loadShoppingLists() {
    this.shoppingListService.fetchShoppingLists().subscribe({
      next: (shoppingLists: ShoppingList[]) => {
        this.shoppingLists = shoppingLists;
      },
      error: error => this.handleErrors(error, "loadShoppingLists")
    });
  }

  handleErrors(error: string, errorKey: string) {
    console.log("error: " + error);
    this.messages.errorMessages.set(errorKey, error);
    this.shoppingLists = [];
  }

}
