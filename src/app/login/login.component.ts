import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from '../auth.service';
import { User } from '../user.model';
import { ErrorMessagesComponent } from '../error-messages/error-messages.component';
import { environment } from '../../environments/environment.development';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  @ViewChild(ErrorMessagesComponent) messages!: ErrorMessagesComponent;

  constructor(private auth: AuthService) {}
  
  ngOnInit(): void {
    console.log("api" + environment.apiUrl);
  }

  loginForm: FormGroup = new FormGroup({
    userName: new FormControl(),
    password: new FormControl()
  })

  onLogin() {
    this.auth.login(this.loginForm.get("userName")?.value, this.loginForm.get("password")?.value).subscribe({
      next: (user) => {
        console.log(user.token);
        this.messages.errorMessages.clear();
        this.messages.successMessages.set("onLogin", "Login Successful");
      },
      error: error => this.handleErrors(error, "onLogin")
    })
  }

  handleErrors(error: string, errorKey: string) {
    console.log("error: " + error);
    this.messages.errorMessages.set(errorKey, error);
    this.messages.successMessages.clear();
  }
}
