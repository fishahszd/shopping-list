import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ShoppingList } from '../shopping-list.model';
import { ShoppingListService } from '../shopping-list.service';
import { ActivatedRoute } from '@angular/router';
import { ShoppingListItem } from '../shopping-list-item.model';
import { Observable, Subscription } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ErrorMessagesComponent } from '../error-messages/error-messages.component';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrl: './shopping-list.component.css'
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  @ViewChild(ErrorMessagesComponent) messages!: ErrorMessagesComponent;
  list!: ShoppingList;
  items: ShoppingListItem[] = [];
  isListOk: boolean = true;
  isItemsOk: boolean = true;
  private subscriptions: Subscription[] = [];

  addItemForm = new FormGroup({
    itemName: new FormControl(), //TODO: ide miert nem enged validator betenni?
  });

  constructor(private shoppingListService: ShoppingListService, private route: ActivatedRoute) {}
  
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get("id");

      this.loadList(+id!);
      this.loadItems(+id!);
    })

    this.subscriptions.push(this.shoppingListService.shoppingListChanged.subscribe(
      (shoppingListId) => {
        console.log("shopping list is dirty: " + shoppingListId);
        this.loadItems(shoppingListId);
      }))
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
      console.log("unsubscribed");
    });
  }

  addItem() {
    const newItem = new ShoppingListItem(0, this.addItemForm.get("itemName")?.value, +this.list.id, 0);
    this.shoppingListService.addItem(newItem);
    this.addItemForm.reset();
  }

  onItemClicked(item: ShoppingListItem) {
    item.done = item.done == 0 ? 1 : 0;
    this.shoppingListService.updateItem(item);
  }

  onDelete(event: Event, item: ShoppingListItem) {
    this.shoppingListService.deleteItem(item);
    event.stopPropagation();
  }

  private loadList(id: number) {
    this.shoppingListService.fetchShoppingList(+id!).subscribe({
      next: shoppingList => {
        this.list = shoppingList;
      },
      error: error => this.handleErrors(error, "loadList")
    })
  }

  private loadItems(id: number) {
    this.shoppingListService.fetchShoppingListItems(id).subscribe({
      next: shoppingListItems => {
        this.items = shoppingListItems;
        this.messages.errorMessages.clear();
        this.messages.infoMessages.clear();
        if (this.items.length == 0) {
          this.messages.infoMessages.set("loadItems", "No items in this list!");
        }
      },
      error: error => this.handleErrors(error, "loadItems")
    })
  }

  handleErrors(error: string, errorKey: string) {
    console.log("error: " + error);
    this.messages.errorMessages.set(errorKey, error);
    this.items = [];
  }
}
