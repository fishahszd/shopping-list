import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ShoppingList } from './shopping-list.model';
import { ShoppingListItem } from './shopping-list-item.model';
import { catchError, Observable, Subject } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {
  public static BASE_URL: string  = environment.apiUrl + "/rest";
  public static SHOPPING_LIST_URL: string = "/shopping-list";
  public static SHOPPING_LIST_ITEM_URL: string = "/shopping-list-item";
  public shoppingListListChanged: Subject<any> = new Subject();
  public shoppingListChanged: Subject<number> = new Subject();

  constructor(private http: HttpClient) { 
  }

  fetchShoppingLists() {
    return this.http.get<ShoppingList[]>(ShoppingListService.BASE_URL + ShoppingListService.SHOPPING_LIST_URL).pipe(
      catchError(error => ShoppingListService.handleErrors(error)));;
  }

  fetchShoppingList(id: number) {
    const url = ShoppingListService.BASE_URL + ShoppingListService.SHOPPING_LIST_URL + "/" + id;
    return this.http.get<ShoppingList>(url).pipe(
      catchError(error => ShoppingListService.handleErrors(error)));;
  }

  fetchShoppingListItems(shoppingListId: number) {
    return this.http.get<ShoppingListItem[]>(ShoppingListService.BASE_URL + ShoppingListService.SHOPPING_LIST_URL + "/" + shoppingListId + ShoppingListService.SHOPPING_LIST_ITEM_URL).pipe(
      catchError(error => ShoppingListService.handleErrors(error)));
  }

  addItem(item: ShoppingListItem) {
    this.http.post(ShoppingListService.BASE_URL + ShoppingListService.SHOPPING_LIST_ITEM_URL, item).subscribe(
      (result) => {
        console.log("post result:" + result);
        this.shoppingListChanged.next(item.shoppingListId);
      }
  );
  }

  addList(list: ShoppingList) {
    this.http.post(ShoppingListService.BASE_URL + ShoppingListService.SHOPPING_LIST_URL, list).subscribe(
      (result) => {
        console.log("post result:" + result);
        this.shoppingListListChanged.next(null);
    })
  }

  deleteList(id: number) {
    this.http.delete(ShoppingListService.BASE_URL + ShoppingListService.SHOPPING_LIST_URL + "/" + id).subscribe(
      (result) => {
        console.log("delete result:" + result);
        this.shoppingListListChanged.next(null);
    })
  }

  deleteItem(item: ShoppingListItem) {
    this.http.delete(ShoppingListService.BASE_URL + ShoppingListService.SHOPPING_LIST_ITEM_URL + "/" + item.id).subscribe(
      (result) => {
        console.log("delete result:" + result);
        this.shoppingListChanged.next(item.shoppingListId);
    })
  }

  updateItem(item: ShoppingListItem) {
    this.http.patch(ShoppingListService.BASE_URL + ShoppingListService.SHOPPING_LIST_ITEM_URL + "/" + item.id, item).subscribe(
      (result) => {
        console.log("patch result:" + result);
        this.shoppingListChanged.next(item.shoppingListId);
    })
  }

  private static handleErrors(error: HttpErrorResponse) : Observable<any>{
      console.log(error);
      switch(error.status) { 
        case 404: { 
          throw "Not found.";
           break; 
        } 
        default: { 
           throw "Unknown Error."
           break; 
        } 
     } 
  }
}
